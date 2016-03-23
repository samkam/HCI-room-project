//Sam Kamenetz 3-1-2016

//objects in room
var objects ={
    light: [
         {x:15,y:25,r:5,color:"rgb(0,0,0)"},
         {x:40,y:150,r:5,color:"rgb(0,0,0)"},
         {x:109,y:74,r:5,color:"rgb(0,0,0)"},
         {x:123,y:280,r:5,color:"rgb(0,0,0)"},
         {x:260,y:180,r:5,color:"rgb(0,0,0)"},
         {x:280,y:40,r:5,color:"rgb(0,0,0)"}
    ],
    window: [
       //vertical
        {main_x:0,main_y:100,main_w:10,main_h:40,inner_x:0,inner_y:120,inner_w:10,inner_h:40},
       //horizontal
        {main_x:41,main_y:53,main_w:30,main_h:18,inner_x:15,inner_y:10,inner_w:30,inner_h:18},
        {main_x:200,main_y:53,main_w:30,main_h:18,inner_x:0,inner_y:0,inner_w:30,inner_h:18},
        //vertical
        {main_x:295,main_y:100,main_w:11,main_h:41,inner_x:0,inner_y:0,inner_w:11,inner_h:41}
    ],
    door: [
        {x:2,y:55, w:0,h:0, locked:true},
        {x:265,y:5, w:0,h:0, locked:true}
    ],
    temperature:40
};
$(document).ready(function(){
    //initialize all sliders to 0
    $("input").attr("value","0");
    //initialize canvas
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var background = new Image();
    background.src = "room.png";
    //load imagaes
    var locked = new Image();
    locked.src = "locked.png";
    var unlocked = new Image();
    unlocked.src = "unlocked.png";
    background.onload = function() {
        refresh_canvas();  
        locked.onload = function() {
            refresh
          unlocked.onload = function() {
            refresh_canvas();  
          };
        };
    };
    //event listener for main buttons
    $("#select_menu").on("click",function(e) {
        console.log(event.target);
        $("button").removeClass("current");
        $(event.target).addClass("current");
        var caller = e.target.getAttribute("id");
        $(".context_hidden").removeClass("current");
        var id = "#"+caller+"_div";
        $(id).addClass("current");
            refresh_canvas();
    });
    
    //looks for input from sliders
    $( "input" ).change(function(e) {
        var parent = $(this).parent();
        var obj_type = parent.attr('id').replace("_div","");
        var index = $(this).attr('data-index');
        
        //checks to see if master switch is caller
        if($(this).hasClass("master") && obj_type != "temperature"){
            var master_val = Number($(this).val());
            $(this).parent().children().each(function() {
                //update all relevant switches
                if(!(this.className=="master")){
                    this.value = master_val;
                    update_obj(this.value,obj_type,Number(this.getAttribute('data-index')));
                }
            });
            
        }
        else{
            update_obj(this.value,obj_type,index);
        }
        refresh_canvas();
    });
    $(".context_hidden.current").on(change,function(e) {
        var caller = e.target.getAttribute("id");
    });


});
function refresh_canvas(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var background= new Image();
    background.src = "room.png";
    ctx.drawImage(background,0,0,300,300);
    var locked = new Image();
    locked.src = "locked.png";
    var unlocked = new Image();
    unlocked.src = "unlocked.png";
    ctx.beginPath();
    
    //draw lights
    for (var i =0; i<objects.light.length; i+=1){
        var t = objects.light[i];
        ctx.arc(t.x,t.y,t.r,0,2*Math.PI);
        ctx.fillStyle = t.color;
        ctx.fill();
        ctx.beginPath();
    }
    
    //draw windows
    for (var i =0; i<objects.window.length; i+=1){
        var t = objects.window[i];
        //create gradient
        var gradient = ctx.createLinearGradient(t.main_x,t.main_y,t.main_x+t.main_w,t.main_y+t.main_h);
        gradient.addColorStop(0,"#fffafa");
        gradient.addColorStop(1,"#00afaf");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(t.main_x,t.main_y,t.main_w,t.main_h);
        ctx.beginPath();
        
        ctx.rect(t.main_x,t.main_y,t.inner_w,t.inner_h);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.beginPath();
        
    }
    //doors
    for (var i =0; i<objects.door.length; i+=1){
        var d = objects.door[i];
        var charcode = "";// variable for representing unicode
        if(d.locked){
            ctx.drawImage(locked,d.x,d.y,30,20);}
        else{ctx.drawImage(unlocked,d.x,d.y,30,20);}
        ctx.beginPath();
    }
    //draw temperature
    ctx.fillText(String(objects.temperature)+ " degrees",15,280);
}
function update_obj(slider_val,obj_type, index){
    
    if(obj_type =="window"){
        update_window(slider_val,index)
    }
    else if(obj_type =="light"){
        update_light(slider_val,index);
    }
    else if(obj_type =="door"){
        update_door(slider_val, index);
    }
    else if(obj_type =="temperature"){
        update_temp(slider_val, index);
    }
}
function update_light(slider_val, index){
    console.log("in update light");
    var new_color = "rgb("+slider_val+","+slider_val+",0)";
    objects.light[index].color= new_color;
}
function update_window(slider_val, index){
    //vertical case
    var window =objects.window[index]; 
    if(index==0 || index==3){
        window.inner_h = window.main_h - window.main_h *(slider_val/2.0); 
    }
    else{
        window.inner_w =window.main_w - window.main_w *(slider_val/2.0);
    }
}
function update_temp(slider_val, index){

    objects.temperature = slider_val;
}
function update_door(slider_val, index){
    if(slider_val==0){
        objects.door[index].locked=true;
    }
    else{
        objects.door[index].locked=false;
    }
}
function panic(){
    window.alert("please don't panic");
}
