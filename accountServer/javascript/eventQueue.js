exports.eventQueue = function(timeout){
    this.queue = [];
    this.running = false;
    this.add = function(event){
        this.queue.push(event);
    };
    this.runLoop = function(){
        if(this.running){
            while(this.queue.length){
                (this.queue.shift)();
            }
            setTimeout(runLoop, timeout);
        }
    };
    this.run = function(){
        if(!this.running){
            this.running = true;
            this.runLoop();
        }
    };
    this.stop = function(){
        this.running = false;
    }
}
