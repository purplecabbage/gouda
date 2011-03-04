

// Construct a new ArrayList using the specified array as its source. If no source is specified an empty array will be used.
ArrayList = function(src_arr)
{
    this.source = src_arr;
}

ArrayList.nextUIDSeed = 0;
ArrayList.prototype.__defineGetter__("length",ArrayList.prototype.get_length);
ArrayList.prototype.__defineGetter__("source",ArrayList.prototype.get_source);
ArrayList.prototype.__defineSetter__("source",ArrayList.prototype.set_source);
ArrayList.prototype.__defineGetter__("uid",ArrayList.prototype.get_uid);
ArrayList.prototype.__defineSetter__("uid",ArrayList.prototype.set_uid);

ArrayList.prototype = {
    
    _array:null, // inner source array
    _eb:null, // aggregated EventDispatcher
    _uid:null,
    
    _getEB:function()
    {
        if(!this._eb)
        {
            this._eb = new EventBroadcaster();
        }
        return this._eb
    },
    
    get_length:function(){ return this.source.length;},
    
    /*
    The source array for this ArrayList. Any changes done through the IList interface will be reflected in the source array. 
    If no source array was supplied the ArrayList will create one internally. 
    Changes made directly to the underlying Array (e.g., calling theList.source.pop() will not cause CollectionEvents to be dispatched.
    */
    get_source:function()
    {
        if(!this._array)
        {
            this._array = [];
        }
        return this._array;
    },
    
    set_source:function(array)
    {
        this._array = array;
        this.fire('collectionchanged');
    },
    
    // Provides access to the unique id for this list.
    get_uid:function()
    {
        if(!this._uid)
        {
            this._uid = "al_" + ArrayList.nextUIDSeed++;
        }
        return this._uid
    },
    
    set_uid:function(val)
    {
        this._uid = val;
    },
    
    // Adds a list of items to the current list, placing them at the end of the list in the order they are passed.
    addAll:function(items)
    {
        this.addAllAt(items,this.source.length);
    },
    
    // Adds a list of items to the current list, placing them at the position index passed in to the function. 
    // The items are placed at the index location and placed in the order they are recieved.
    addAllAt:function(items,index)
    {
        this.source.splice(index,0,items);
        this.fire('collectionchanged');
    },
    
    // Adds the specified item to the end of the list
    addItem:function(item)
    {
        this.addItemAt(item,this.length);
    },
    //Adds the item at the specified index.
    addItemAt:function(item,index)
    {
        this.source.splice(index,0,item);
        this.fire('collectionchanged');
    },
    // Dispatches an event into the event flow.
    fire:function(evt)
    {
        this._getEB().fire(evt);
    },
    // Gets the item at the specified index.
    getItemAt:function(index)
    {
        return this.source[index];
    },
    // Returns the index of the item if it is in the list such that getItemAt(index) == item.
    getItemIndex:function(item)
    {
        var ar = this.source;
        for(var n = ar.length -1 ; n > -1 ; n-- )
        {
            if(ar[n] == item)
            {
                break;
            }
        }
        return n;
    },
    
    // Notify the view that an item has been updated. 
    // This is useful if the contents of the view do not implement IEventDispatcher. 
    // If a property is specified the view may be able to optimize its notification mechanism. 
    // Otherwise it may choose to simply refresh the whole view.
    itemUpdated:function(item,prop,oldValue,newValue)
    {
        // TODO: this.fire(); // property change event
    },
    
    // Called whenever any of the contained items in the list fire an ObjectChange event. 
    // Wraps it in a CollectionEventKind.UPDATE.
    itemUpdateHandler:function(event)
    {
        
    },
    
    // Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event.
    on:function(type,context,listener)
    {
        this._getEB().on(type,context,listener);
    },
    
    // Removes all items from the list.
    removeAll:function()
    {
        this.source = [];
        this.fire('collectionchanged');
    },
    
    // Removes the specified item from this list, should it exist.
    removeItem:function(item)
    {
        var index = this.getItemIndex(item);
        if(index > -1)
        {
            return ( this.removeItemAt(index) != null);
        }
        return false;
    },
    
    // Removes the item at the specified index and returns it.
    removeItemAt:function(index)
    {
        var item = this.source.splice(index,1);
        this.fire('collectionchanged');
        return item;
    },
    // Places the item at the specified index.
    setItemAt:function(item,index)
    {
        this.source[index] = item;
        this.fire('collectionchanged');
    },
    
    // If the item is an IEventDispatcher watch it for updates. 
    // This is called by addItemAt and when the source is initially assigned.
    startTrackUpdates:function(item)
    {
        // TODO:
    },
    
    // If the item is an IEventDispatcher stop watching it for updates. 
    // This is called by removeItemAt, removeAll, and before a new source is assigned.
    stopTrackUpdates:function(item)
    {
        // TODO:
    },
    
    // Returns an Array that is populated in the same order as the IList implementation.
    toArray:function()
    {
        return this.source.slice();
    },
    
    toString:function()
    {
        return this.source.toString();
    },
    
    // Removes a listener from the EventDispatcher object.
    un:function(type,listener)
    {
        this._getEB().un(type,context,listener);
    }
}

