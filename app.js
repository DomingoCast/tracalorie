// Storage Controller
const StorageCtrl = (function(){
    //public
    return{
        storeItem: item => {
            let items
            if (localStorage.getItem('items') === null){
                localStorage.setItem('items', JSON.stringify([item]))
            }else{
                items = JSON.parse(localStorage.getItem('items'))
                console.log(items, item)
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getAllItems: () => {
            let items
            if (localStorage.getItem('items') === null){
                return []
            }else{
                return JSON.parse(localStorage.getItem('items'))
           }
        },
        updateItem: item => {
            let items = JSON.parse(localStorage.getItem('items'))
            let index= 0
            for(i of items){
                if( i.id === item.id){
                    items.splice(index, 1, item)
                }
                index++
            }
            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItem: item => {
            let items = JSON.parse(localStorage.getItem('items'))
            let index = 0
            for(i of items){
                if( i.id === item.id){
                    items.splice(index, 1)
                }
                index++
            }
            localStorage.setItem('items', JSON.stringify(items))
        },
        clearItems: () => localStorage.clear() 
    }
})()

// Item COntroler
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //Data Structure / State
    const data = {
        //items: [
            //{id:1, name: 'Stake Dinner', calories: 1200},
            //{id:2, name: 'Feishuada', calories: 9000},
            //{id:3, name: 'lentejitas', calories: 800},
        //],
        items : StorageCtrl.getAllItems(),
        currentItem: null,
        totalCalories: 0,
    }

    const createID = ()=> (data.items.length === 0)? 0 : (data.items[data.items.length - 1].id + 1)
    //function createID(){
        //if (data.items.length === 0)
            //return 0
        //else
            //return data.items[data.items.length-1].id + 1
        
    //}

    //Public methods porque estan en el return
    return{
        getItems:()=>data.items,
        getTCal:()=>data.totalCalories,
        setTCal:()=>{
            let total = 0
            for(item of data.items){
                total += item.calories
            }
            data.totalCalories = total
        },

        getCurrent: () => data.currentItem,
        logData:()=>data,
        addItem: (name, calories)=>{
            var newItem = new Item(createID(), name, calories)
            data.items.push(newItem)
            data.totalCalories += calories
            return newItem
        },
        getItemById(id){
            for (const item of data.items){
                if (item.id === id){
                    return item
                }
            }
        },
        setCurrent(item){
            data.currentItem = item
        },
        updateItem: (item, name, calories) => {
            console.log(data.totalCalories)
            data.totalCalories -= item.calories
            console.log(data.totalCalories)
            item.name = name
            item.calories = calories
            data.totalCalories += item.calories
            console.log(data.totalCalories)
        },
        deleteItem: item => {
            let index = 0
            for(inItem of data.items){
                if (inItem.id === item.id){
                    data.totalCalories -= item.calories
                    data.items.splice(index,1)
                }
                index++
            }
        },
        clearItems: () => [data.items, data.totalCalories] = [[], 0]
    }
})();

// UI Controller
const UICtrl = (function(){
    var enter
    const UISelectors = {       // Asi si cambia el id, solo hay que cambiar una variable
        itemList:'#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        editItem: '.edit-item',
        editItemClass: 'edit-item',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories',

    
    }
    return{
        pplIL:items=>{
            let html = ''
            items.forEach(item=> html+=
                `
                <li class="collection-item" id="item-${item.id}">
                  <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                  <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                  </a>
                </li>
                `)
            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        updateTCal :(tCals)=>{
            document.querySelector(UISelectors.totalCalories).textContent = tCals
        },
        getInput: ()=>{
            return{
            name :  document.querySelector(UISelectors.itemName).value,
            calories : document.querySelector(UISelectors.itemCalories).value,
            }
        },
        displayItem: (newItem) => {
            let newElement = document.createElement('li')
            newElement.id = `item-${newItem.id}`
            newElement.className = 'collection-item'
            newElement.innerHTML = `
                  <strong>${newItem.name}: </strong> <em>${newItem.calories} calories</em>
                  <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                  </a>
                `
            document.querySelector(UISelectors.itemList).appendChild(newElement)

        },
        selectors:()=>UISelectors,
        clear: ()=> {
            document. querySelector(UISelectors.itemName).value = ''
            document. querySelector(UISelectors.itemCalories).value = ''
        },
        hide: () => document.querySelector(UISelectors.itemList).style.display = 'none',
        show: () => document.querySelector(UISelectors.itemList).style.display = 'block',
        displayAdd: () => {
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).disabled = false
            enter = 'add'
        },
        displayEdit : (item) => {
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).disabled = true
            document.querySelector(UISelectors.itemName).value = item.name
            document.querySelector(UISelectors.itemCalories).value = item.calories
            enter = 'update'
        },
        //get go to grandpa element, get id string, split it to get number and return it in number form
        getID : target => parseInt(target.parentElement.parentElement.id.split('-')[1]),
        getEnter: () => enter,
        updateElement: item =>{
            element = document.querySelector(`#item-${item.id}`)
            element.innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `
        },
        deleteElement: item => {
            document.querySelector(`#item-${item.id}`).remove()
        },
        clearElements: () => {
            document.querySelector(UISelectors.itemList).innerHTML = ''

        }


    }

})();


// App Controller
const App  = (function(ItemCtrl, StorageCtrl, UICtrl){
    const UISelectors = UICtrl.selectors()

    //All events here
    function eventListener(){
        // cambiar el uso del enter en edit mode y add mode
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                if(UICtrl.getEnter() === 'add'){
                    checkInput(e)
                }else if(UICtrl.getEnter() === 'update'){
                    checkUpdate(e)
                }
            e.preventDefault()
            }
        })
        document.querySelector(UISelectors.addBtn).addEventListener('click', checkInput)
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', checkDelete)
        document.querySelector(UISelectors.updateBtn).addEventListener('click', checkUpdate)
        document.querySelector(UISelectors.itemList).addEventListener('click', checkEdit)
        document.querySelector(UISelectors.clearBtn).addEventListener('click', checkClear)
        document.querySelector(UISelectors.backBtn).addEventListener('click', checkBack)
    }
    

    function checkFields(){
        var input = UICtrl.getInput()
        if(input.name !== '' && input.calories !== ''){
            if (Number.isNaN(parseInt(input.calories))){
                console.log('das not a calorie ma main man')
                return false
            }else{
                input.calories = parseInt(input.calories)
                return input
            }
        }else{
            console.log('fill it bro')
            return false
        }
    }

    function checkInput(e){
        input = checkFields()
        if(input !== false){
            input = checkFields()
            var newItem = ItemCtrl.addItem(input.name, parseInt(input.calories))
            UICtrl.displayItem(newItem)
            UICtrl.updateTCal(ItemCtrl.getTCal())
            UICtrl.clear()
            UICtrl.show()
            StorageCtrl.storeItem(newItem)
        }
        e.preventDefault()
    }

    function checkEdit(e){
        if(e.target.classList.contains(UISelectors.editItemClass)){
            id = UICtrl.getID(e.target)
            item = ItemCtrl.getItemById(id)
            ItemCtrl.setCurrent(item)
            UICtrl.displayEdit(item)
        }
        e.preventDefault()
    }

    function checkUpdate(e){
        input = checkFields()
        if(input !== false){
            //get item that was selected
            item = ItemCtrl.getCurrent()
            //update item
            ItemCtrl.updateItem(item, input.name, input.calories)
            //update UI
            UICtrl.updateElement(item)
            UICtrl.clear()
            UICtrl.displayAdd()
            UICtrl.updateTCal(ItemCtrl.getTCal())
            StorageCtrl.updateItem(item)
        } 
        e.preventDefault()
    }
    function checkDelete(e){
        item = ItemCtrl.getCurrent()
        ItemCtrl.deleteItem(item)
        UICtrl.deleteElement(item)
        UICtrl.updateTCal(ItemCtrl.getTCal())
        UICtrl.clear()
        UICtrl.displayAdd()
        StorageCtrl.deleteItem(item)
        e.preventDefault
    }
    function checkBack(e){
        UICtrl.clear()
        UICtrl.displayAdd()
        e.preventDefault()
    }
    function checkClear(e){
        ItemCtrl.clearItems()
        UICtrl.clearElements()
        UICtrl.hide()
        StorageCtrl.clearItems()
        e.preventDefault
    }

    return{
        init:function(){
            ItemCtrl.setTCal()
            //const items = StorageCtrl.getAllItems()
            const items = ItemCtrl.getItems()
            UICtrl.displayAdd()
            if(items.length === 0)
                UICtrl.hide()
            else
                UICtrl.pplIL(items)
                UICtrl.updateTCal(ItemCtrl.getTCal())

            eventListener()
            
        }
    }

    
})(ItemCtrl, StorageCtrl, UICtrl);

App.init()
