// ========= tab切换公共逻辑 =========
const tabItems = document.querySelectorAll('.tab-item');
const tabPanels = document.querySelectorAll('.tab-panel');
tabItems.forEach(tab=>{
    tab.onclick = function(){
        const targetTab = this.dataset.tab;
        tabItems.forEach(t=>t.classList.remove('active'));
        tabPanels.forEach(p=>p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(`panel-${targetTab}`).classList.add('active');
    }
})


// ========= Todo 日程待办模块 =========
const selectDate = document.querySelector('#selectDate');
const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');
selectDate.valueAsDate = new Date();


function getTodoByDate(d){
    return JSON.parse(localStorage.getItem(`todo-${d}`)) || [];
}
function saveTodoByDate(d,arr){
    localStorage.setItem(`todo-${d}`, JSON.stringify(arr));
}

// ✅伪小组件渲染函数（适配你原有函数名）
function renderWidgetTodo(){
    const widgetWrap = document.getElementById('widget-todo-list');
    const current = selectDate.value;
    const list = getTodoByDate(current);
    if(!list || list.length ===0){
        widgetWrap.innerHTML = `<div class="empty-tip">暂无今日任务</div>`;
        return;
    }
    let html = '';
    list.forEach(item=>{
        html += `<div class="widget-item">• ${item}</div>`;
    })
    widgetWrap.innerHTML = html;
}

function renderTodo(){
    const day = selectDate.value;
    const arr = getTodoByDate(day);
    todoList.innerHTML = '';
    arr.forEach((item,idx)=>{
        const div = document.createElement('div');
        div.className="list-item";
        div.innerHTML = `<span>${item}</span><button class="del-btn" data-idx="${idx}">×</button>`;
        todoList.appendChild(div);
    })
    renderWidgetTodo();
}
addTodoBtn.onclick = ()=>{
    const val = todoInput.value.trim();
    const day = selectDate.value;
    if(!val) return;
    const arr = getTodoByDate(day);
    arr.push(val);
    saveTodoByDate(day,arr);
    todoInput.value='';
    renderTodo();
}
selectDate.onchange = function(){
    renderTodo();
    renderWidgetTodo();
};
todoList.onclick = e=>{
    if(e.target.classList.contains('del-btn')){
        const idx = Number(e.target.dataset.idx);
        const day = selectDate.value;
        const arr = getTodoByDate(day);
        arr.splice(idx,1);
        saveTodoByDate(day,arr);
        renderTodo();
    }
}
renderTodo();
renderWidgetTodo()

document.querySelectorAll('.quick-todo').forEach(btn=>{
  btn.onclick = function(){
    const text = this.dataset.text;
    todoInput.value = text;
  }
})


const costInput = document.querySelector('#costInput');
const addCostBtn = document.querySelector('#addCost');
const costList = document.querySelector('#costList');
function getCost(){
    return JSON.parse(localStorage.getItem('cost'))||[];
}
function saveCost(arr){
    localStorage.setItem('cost',JSON.stringify(arr));
}
function renderCost(){
    const arr = getCost();
    costList.innerHTML='';
    arr.forEach((item,idx)=>{
        const div = document.createElement('div');
        div.className="list-item";
        div.innerHTML = `<span>${item}</span><button class="del-btn" data-idx="${idx}">×</button>`;
        costList.appendChild(div);
    })
}
addCostBtn.onclick=()=>{
    const val = costInput.value.trim();
    if(!val) return;
    const arr = getCost();
    arr.push(val);
    saveCost(arr);
    costInput.value='';
    renderCost();
}
costList.onclick=e=>{
    if(e.target.classList.contains('del-btn')){
        const idx = Number(e.target.dataset.idx);
        const arr = getCost();
        arr.splice(idx,1);
        saveCost(arr);
        renderCost();
    }
}
renderCost();


// ========== 训练计划【1.训练模板库：有氧日/肩背日/臀腿日】 ==========
const trainTemplateBtnWrap = document.querySelector('#trainTemplateBtnWrap');
const templateNameInput = document.querySelector('#templateNameInput');
const addNewTemplateBtn = document.querySelector('#addNewTemplate');
const templateEditArea = document.querySelector('#templateEditArea');
const actionNameInput = document.querySelector('#actionNameInput');
const setInput = document.querySelector('#setInput');
const repInput = document.querySelector('#repInput');
const addActionBtn = document.querySelector('#addActionBtn');
const templateActionList = document.querySelector('#templateActionList');
const importTemplateToDayBtn = document.querySelector('#importTemplateToDay');
const delCurrentTemplateBtn = document.querySelector('#delCurrentTemplate');


// 当前选中模板id
let activeTemplateId = null;


//模板存储结构：[{id:string,name:"肩背日",actions:[{name:"侧平举",sets:4,reps:15}]}]
function getTrainTemplates(){
    return JSON.parse(localStorage.getItem('trainTemplates')) || [];
}
function saveTrainTemplates(list){
    localStorage.setItem('trainTemplates', JSON.stringify(list));
}


//渲染顶部模板小按钮
function renderTemplateButtons(){
    const list = getTrainTemplates();
    trainTemplateBtnWrap.innerHTML = '';
    list.forEach(tpl=>{
        const btn = document.createElement('button');
        btn.className = "template-tag-btn"+ (activeTemplateId===tpl.id?" active":"");
        btn.innerText = tpl.name;
        btn.dataset.tplid = tpl.id;
        btn.onclick = ()=>{
            activeTemplateId = tpl.id;
            renderTemplateButtons();
            renderTemplateActionList();
            templateEditArea.style.display = "block";
        }
        trainTemplateBtnWrap.appendChild(btn);
    })
    if(!activeTemplateId){
        templateEditArea.style.display = "none";
    }
}


//渲染当前选中模板里面动作列表
function renderTemplateActionList(){
    const allTpl = getTrainTemplates();
    const tpl = allTpl.find(x=>x.id===activeTemplateId);
    if(!tpl) return;
    templateActionList.innerHTML = '';
    tpl.actions.forEach((act,idx)=>{
        const div = document.createElement('div');
        div.className = "list-item";
        div.innerHTML = `<span>${act.name}｜${act.sets}组×${act.reps}次</span>
        <button class="del-btn" data-idx="${idx}">×</button>`;
        templateActionList.appendChild(div);
    })
}


//新增整套训练模板
addNewTemplateBtn.onclick = ()=>{
    const tplName = templateNameInput.value.trim();
    if(!tplName) return alert("输入模板名称，例如肩背日");
    const all = getTrainTemplates();
    const newId = Date.now().toString();
    all.push({
        id: newId,
        name: tplName,
        actions: []
    })
    saveTrainTemplates(all);
    templateNameInput.value = '';
    activeTemplateId = newId;
    renderTemplateButtons();
    renderTemplateActionList();
    templateEditArea.style.display = "block";
}

addActionBtn.onclick = ()=>{
    if(!activeTemplateId) return alert("请先选择/新建训练模板");
    const aName = actionNameInput.value.trim();
    const s = Number(setInput.value);
    const r = Number(repInput.value);
    if(!aName || !s || !r) return alert("填写完整动作、组数、次数");
    const all = getTrainTemplates();
    const tpl = all.find(x=>x.id===activeTemplateId);
    tpl.actions.push({name:aName,sets:s,reps:r});
    saveTrainTemplates(all);
    actionNameInput.value='';setInput.value='';repInput.value='';
    renderTemplateActionList();
}

templateActionList.onclick = e=>{
    if(e.target.classList.contains('del-btn')){
        const idx = Number(e.target.dataset.idx);
        const all = getTrainTemplates();
        const tpl = all.find(x=>x.id===activeTemplateId);
        tpl.actions.splice(idx,1);
        saveTrainTemplates(all);
        renderTemplateActionList();
    }
}

importTemplateToDayBtn.onclick = ()=>{
    if(!activeTemplateId) return alert("先选择模板");
    const day = trainSelectDate.value;
    const all = getTrainTemplates();
    const tpl = all.find(x=>x.id===activeTemplateId);
    if(tpl.actions.length===0) return alert("模板暂无动作");
    const dayData = getTrainByDate(day);
    tpl.actions.forEach(act=>{
        dayData.push(`${act.name} ${act.sets}组×${act.reps}次`);
    })
    saveTrainByDate(day, dayData);
    renderTrain();
    alert(`已把【${tpl.name}】导入今日训练记录`);
}

delCurrentTemplateBtn.onclick = ()=>{
    if(!activeTemplateId) return;
    if(!confirm("确定删除整套训练模板？")) return;
    let all = getTrainTemplates();
    all = all.filter(x=>x.id!==activeTemplateId);
    saveTrainTemplates(all);
    activeTemplateId = null;
    renderTemplateButtons();
    templateActionList.innerHTML = '';
}
const trainSelectDate = document.querySelector('#trainSelectDate');
const trainInput = document.querySelector('#trainInput');
const addTrainBtn = document.querySelector('#addTrain');
const trainList = document.querySelector('#trainList');
trainSelectDate.valueAsDate = new Date();
function getTrainByDate(dateStr){
  const key = `train‑${dateStr}`;
  return JSON.parse(localStorage.getItem(key)) || [];
}
function saveTrainByDate(dateStr, arr){
  localStorage.setItem(`train‑${dateStr}`, JSON.stringify(arr));
}
function renderTrain(){
  const day = trainSelectDate.value;
  const list = getTrainByDate(day);
  trainList.innerHTML = '';
  list.forEach((item,idx)=>{
    const div = document.createElement('div');
    div.className = "list-item";
    div.innerHTML = `
      <span>${item}</span>
      <button data-idx="${idx}" class="del-train">×</button>
    `;
    trainList.appendChild(div);
  })
}
addTrainBtn.onclick = ()=>{
  const val = trainInput.value.trim();
  const day = trainSelectDate.value;
  if(!val) return;
  const arr = getTrainByDate(day);
  arr.push(val);
  saveTrainByDate(day, arr);
  trainInput.value = '';
  renderTrain();
}
trainSelectDate.onchange = renderTrain;
trainList.onclick = e=>{
  if(e.target.classList.contains('del-train')){
    const idx = Number(e.target.dataset.idx);
    const day = trainSelectDate.value;
    const arr = getTrainByDate(day);
    arr.splice(idx,1);
    saveTrainByDate(day,arr);
    renderTrain();
  }
}

renderTemplateButtons();
renderTrain();
const addCourseBtn = document.querySelector('#addCourse');
const courseNameInput = document.querySelector('#courseNameInput');
const courseWeekday = document.querySelector('#courseWeekday');
const coursePeriod = document.querySelector('#coursePeriod');
const timetableWrap = document.querySelector('.timetable-wrap');
function getTimetable(){
  return JSON.parse(localStorage.getItem('timetable')) || [];
}
function saveTimetable(list){
  localStorage.setItem('timetable', JSON.stringify(list));
}
function renderTimetable(){
  const data = getTimetable();
  const weekArr = ['','周一','周二','周三'];
  let html = `<table class="timetable-table">`;
  html += `<tr><th>节次</th>`;
  for(let w=1;w<=3;w++) html += `<th>${weekArr[w]}</th>`;
  html += `</tr>`;
  for(let p=1;p<=5;p++){
    html += `<tr><td><b>第${p}节</b></td>`;
    for(let w=1;w<=3;w++){
      const course = data.find(c=> c.week === w && c.period === p);
      if(course){
        html += `<td class="course-cell">
            ${course.name}
            <button class="course-del" data-w="${w}" data-p="${p}">×</button>
        </td>`;
      }else{
        html += `<td></td>`;
      }
    }
    html += `</tr>`;
  }
  html += `</table>`;
  timetableWrap.innerHTML = html;
}
addCourseBtn.onclick = function(){
  const name = courseNameInput.value.trim();
  const w = Number(courseWeekday.value);
  const p = Number(coursePeriod.value);
  if(!name){
    alert("请输入课程名称");
    return;
  }
  let arr = getTimetable();
  arr = arr.filter(item=> !(item.week === w && item.period === p));
  arr.push({week:w, period:p, name: name});
  saveTimetable(arr);
  courseNameInput.value = '';
  renderTimetable();
}

timetableWrap.onclick = function(e){
  if(e.target.classList.contains('course-del')){
    const w = Number(e.target.dataset.w);
    const p = Number(e.target.dataset.p);
    let arr = getTimetable();
    arr = arr.filter(item=> !(item.week===w && item.period===p));
    saveTimetable(arr);
    renderTimetable();
  }
}
renderTimetable();
