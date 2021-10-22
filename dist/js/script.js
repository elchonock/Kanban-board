"use strict";

document.addEventListener("DOMContentLoaded", function() {
//---------------------------------------------------------------------------------------------------------------------
//**************class to get, add, update and remove items of localStorage***************************************************************************************
    class KanbanAPI{
        static getItems(columnId) {
            const column = read().find(column=> column.id == columnId);

            if (!column) {
                return [];
            }

            return column.items;
        }
        static insertItem(columnId, content) {
            const data = read();
            const column = data.find(column=> column.id == columnId);
            const item = {
                id: Math.floor(Math.random() * 1000000),
                content
            };
            if (!column){
                throw new Error('column does not exist');
            }
            column.items.push(item);
            save(data);

            return item;

        }
        static updateItem(itemId, newProps) {
            const data = read();
            const [item, currentColumn] = (()=>{
                for (const column of data){
                    const item = column.items.find(i=>i.id == itemId);
                    if (item) {
                        return [item, column];
                    }

                }
                if (!item) {
                    throw new Error('no such item');
                }
            })();

            item.content = newProps.content ?? item.content;
//----update column and position--------------------------------------
            if (newProps.columnId != undefined && newProps.position != undefined) {
                const targetColumn = data.find(col=>col.id == newProps.columnId);
                if (!targetColumn){
                    throw new Error('target column not found');
                }
        //-------delete-item-from-current-column----------------------------------------------
                currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
        //------move-item-into-new-column-----------------------------------------------------
                targetColumn.items.splice(newProps.position, 0, item);
            }
            
            save(data);

        }
        static deleteItem(itemId) {
            const data = read();
            for (const column of data) {
                const item = column.items.find(i => i.id == itemId);
                if (item){
                    column.items.splice(column.items.indexOf(item), 1);
                }
   
            }

            save(data);
        }

    }

    function read() {
        const json = localStorage.getItem('kanban_data');
        if (!json) {
            return [
                {
                    id: 1,
                    items:[{id: 11111, content: 'write your first task here..'}]
                },
                {
                    id: 2,
                    items:[]
                },
                {
                    id: 3,
                    items:[]
                },
                {
                    id: 4,
                    items:[]
                },
            ];
        }
        return JSON.parse(json);
    }

    function save(data) {
        localStorage.setItem('kanban_data', JSON.stringify(data));
    }


//--------------------------------------------------------------------------------------------------
//--------New Class --creating board main elems-----------------------------------------------------------------------------
    class Kanban{
        constructor(root){
            this.root = root;
            Kanban.columns().forEach(column => {
                //create an instance of column class
                const columnView = new Column(column.dataId, column.id, column.title);

                this.root.appendChild(columnView.elements.root);
            });
        }

        static columns() {
            return [
                {dataId: 1, id: '_todo', title: 'To Do'},
                {dataId: 2, id: '_inProgress', title: 'In Progress'},
                {dataId: 3, id: '_done', title: 'Done'},
                {dataId: 4, id: '_doTomorrow', title: 'Do Tomorrow'}
            ];

        }

    }



//***************Column class************************************************************************************
//***************************************************************************************************
    class Column {
        constructor(dataId, id, title) {
            const topDropZone = DropZone.createDropZone();

            this.elements = {};
            this.elements.root = Column.createRoot();
            this.elements.title = this.elements.root.querySelector('.column__title span');
            this.elements.items = this.elements.root.querySelector('.column__items');
            this.elements.addBtn = this.elements.root.querySelector('.column__button');
            
            this.elements.root.id = id;
            this.elements.root.dataset.id = dataId;
            this.elements.title.textContent = title;

            this.elements.items.appendChild(topDropZone);

            this.elements.addBtn.addEventListener('click', () => {
                // add item---------------
                const newItem = KanbanAPI.insertItem(dataId, "");
                this.renderItem(newItem);

            });

            KanbanAPI.getItems(dataId).forEach(item => {
                this.renderItem(item);
            });

        }

        static createRoot() {
            const range = document.createRange();
            range.selectNode(document.body);
            return range.createContextualFragment(`
            <div class="board__column column" id="">
                <h2 class="column__title "> <span></span></h2>
                <div class="column__content">
                    <div class="column__items">

                    </div>
                    <button class="column__button column__item _add">+Add</button>
                </div>
            </div>

            `).children[0];

        }
        renderItem(data) {
            //create an item instance------------
            const item = new Item(data.id, data.content);

            this.elements.items.appendChild(item.elements.root);

        }


    }




//****************Class Item***********************************************************
//***************************************************************************
    class Item {
        constructor(id, content) {
            const bottomDropZone = DropZone.createDropZone();

            this.elements = {};
            this.elements.root = Item.createItemRoot();
            this.elements.input = this.elements.root.querySelector('.column__item-input');

            this.elements.root.dataset.id = id;
            this.elements.input.textContent = content;
            this.content = content; //??
            this.elements.root.appendChild(bottomDropZone);

            const onBlur = () => {
                const newContent = this.elements.input.textContent.trim();
                if (newContent == this.content) {
                    return;
                }
                this.content = newContent;
                KanbanAPI.updateItem(id, {content: this.content});
            };

            this.elements.input.addEventListener('blur', onBlur);

//--------delete item by dblclick-----------------------------------------------------
//----------------------------------------------------------------------------------
            // this.elements.root.addEventListener('dblclick', () => {
            //     const check = confirm('Are you sure you want to delete this item?');
            //     if (check) {
            //         KanbanAPI.deleteItem(id);
            //         this.elements.input.removeEventListener('blur', onBlur);
            //         this.elements.root.parentElement.removeChild(this.elements.root);
            //     }
            // });

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////delete btn//////////////////////////////////////////////////////////////
            const deleteBtn = document.createElement('div');
            deleteBtn.classList.add('deleteBtn');
            deleteBtn.style.cssText = `
            display: block;
            position: absolute;
            width: 45px;
            min-height: 45px;
            right: -12px;
            z-index: 2;
            top: 5px;
            `;
            this.elements.root.appendChild(deleteBtn); 
            deleteBtn.addEventListener('mouseover', e =>{
                deleteBtn.classList.add('_active');

            });
            deleteBtn.addEventListener('mouseout', e =>{
                deleteBtn.classList.remove('_active');

            });

            deleteBtn.addEventListener('click', event=>{
                const check = confirm('Are you sure you want to delete this item?');
                if (check) {
                    KanbanAPI.deleteItem(id);
                    this.elements.input.removeEventListener('blur', onBlur);
                    this.elements.root.parentElement.removeChild(this.elements.root);
                    this.elements.root.removeChild(deleteBtn); 
                } else {
                    return;
                }
            });
//////////////////////////////////////////////////////////////////////////////////////////////////


            this.elements.root.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', id);
                e.dataTransfer.setDragImage(this.elements.input, 0, 0);
            } );

//*********** to prevent the text appearing inside input element by accident
            this.elements.input.addEventListener('drop', e => {
                e.preventDefault();
            } );

        }

        static createItemRoot() {
            const range = document.createRange();
            range.selectNode(document.body);

            return range.createContextualFragment(`
            <div class="column__item _draggable" id="draggable" draggable="true">
                    <div class="column__item column__item-input" contenteditable="true"> 
                    </div>                
            </div>
            `).children[0];
        }


    }


    class DropZone {
        static createDropZone() {
            const range = document.createRange();
            range.selectNode(document.body);

            const dropZone =  range.createContextualFragment(`
            <div class="_dropzone"></div>
            `).children[0];

            //
            dropZone.addEventListener('dragover', e => {
                e.preventDefault();
                dropZone.classList.add('_active');
            });
            dropZone.addEventListener('dragleave', e => {
                dropZone.classList.remove('_active');

            });


            dropZone.addEventListener('drop', e => {
                e.preventDefault();
                dropZone.classList.remove('_active');

                const dropColumn = dropZone.closest('.board__column');
                const columnId = +dropColumn.dataset.id;
                const dropZonesInColumn = Array.from(dropColumn.querySelectorAll('._dropzone'));
                const dropZoneIndex = dropZonesInColumn.indexOf(dropZone);
                const itemId = +e.dataTransfer.getData('text/plain');
                const droppedItemElem = document.querySelector(`[data-id='${itemId}']`);
                const insertAfterDropzone = dropZone.parentElement
                    .classList.contains('column__item') ? dropZone.parentElement : dropZone;
                
                if (droppedItemElem.contains(dropZone)) {
                    return;
                }

                insertAfterDropzone.after(droppedItemElem);

                KanbanAPI.updateItem(itemId, {
                    columnId,
                    position: dropZoneIndex
                });

            });
            return dropZone;

        }
    }



//////////////////////////////////////////////////////////////////////////////////////////

    new Kanban(document.querySelector(".board__wrapper"));

/////////////////////////////////////////////////////////////////////////////
//----add new Item with dbl click

    const colContent = document.querySelectorAll('.column__content');

    colContent.forEach(col=>{
        col.addEventListener('dblclick', e=>{
            if (e.target.classList.contains('_dropzone')) {
                const dropColumn = e.target.closest('.board__column');
                const columnId = +dropColumn.dataset.id;
                const newElem = KanbanAPI.insertItem(columnId, "");
                const colItems = dropColumn.querySelector('.column__items');
                const newI = new Item(newElem.id, newElem.content);
                colItems.appendChild(newI.elements.root);

            }

        });
    });




    // // this implementation has a bug, new _dropzone elements can't be reached and listened

    // const allDropZones = document.querySelectorAll('._dropzone');
    // allDropZones.forEach(zone=> {
    //     zone.addEventListener('dblclick', e=>{
    //         const dropColumn = zone.closest('.board__column');
    //         const columnId = +dropColumn.dataset.id;
    //         const newElem = KanbanAPI.insertItem(columnId, "");
    //         const colItems = dropColumn.querySelector('.column__items');
    //         const newI = new Item(newElem.id, newElem.content);
    //         colItems.appendChild(newI.elements.root);
            
    //     });

    // });



//////////////////smooth scroll to top////////////////////////////////////
    const topBtn = document.querySelector('.btnUp');
    let aElemToTop = topBtn.querySelector('a');
    aElemToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });        


//////////////////////////////////////////////////////////////////////////////////////////////
///////////////btn up scroll/////////////////////////////////////////////////////////////////
    window.addEventListener('scroll', e => {
        const scrolled = document.documentElement.scrollTop;
        // const height = 250;
        if (scrolled >= 250) {
            topBtn.classList.add('_active');
        } else {
            topBtn.classList.remove('_active');
        } 

    });

////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
    // Hide Hint
    // add _hidden-hint class to first column__content element to hide hint
    
    const colContentHint = document.querySelector('#_todo .column__content');

    if (localStorage.getItem('hint') && localStorage.getItem('hint') == 'hidden') {
        colContentHint.classList.add('_hidden-hint');
    } else {
        localStorage.setItem('hint', '');
        colContentHint.addEventListener('click', e=>{
            colContentHint.classList.add('_hidden-hint');
            localStorage.setItem('hint', 'hidden');
        });
    }




///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

});