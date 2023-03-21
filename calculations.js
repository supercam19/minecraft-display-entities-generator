function transform() {

    var result = generate_matrix("web");
    var x_offset = document.getElementById("x_translate").value;
    var y_offset = document.getElementById("y_translate").value;
    var z_offset = document.getElementById("z_translate").value;
    document.getElementsByClassName("cube")[0].style.transform = "matrix3d("+result[0][0]+","+result[1][0]+","+result[2][0]+","+result[3][0]+","+result[0][1]+","+result[1][1]+","+result[2][1]+","+result[3][1]+","+result[0][2]+","+result[1][2]+","+result[2][2]+","+result[3][2]+","+result[0][3]+","+result[1][3]+","+result[2][3]+","+result[3][3]+")"
    document.getElementsByClassName("cube")[0].style.transform += " translateX("+x_offset*100+"px) translateY("+-y_offset*100+"px) translateZ("+z_offset*100+"px)"
    document.getElementsByClassName("cube_original")[0].style.transform = " translateX("+-x_offset*100+"px) translateY("+y_offset*100+"px) translateZ("+-z_offset*100+"px)"
    generate_command();
}

function generate_command() {
	var mtx_prc = 3;
    var result = generate_matrix("game");
    //Get additional parameters for the command
    var sky_light = Math.trunc(document.getElementById("sky_light").value) || -1;
    var block_light = Math.trunc(document.getElementById("block_light").value) || -1;
    var billboard = document.getElementById("billboard").value;
    var anim_duration = document.getElementById("anim_duration").value;
    anim_duration = Math.trunc(anim_duration * 20);
    var shadow_radius = document.getElementById("shadow_radius").value;
    var shadow_strength = document.getElementById("shadow_strength").value;
    var view_range = document.getElementById("view_range").value;
    if (document.getElementById("override_glow").checked) {var glow = parseInt(document.getElementById("glow_color").value.substring(1),16);} else {var glow = -1;}
    var is_glowing = document.getElementById("is_glowing").checked;
    var ct = document.getElementById("commandType").value;
    var et = document.getElementById("entityType").value;
    var command = "";
    switch (ct) {
        case 'summon':
            command ="summon minecraft:"+et+" ~ ~1 ~ {";
            break;
        case 'data':
            command = "data merge entity @e[type=minecraft:"+et+",limit=1,sort=nearest] {";
            break;
        case 'execute_summon':
            command = "execute positioned ~ ~1.5 ~ summon minecraft:"+et+" run data merge entity @s {";
            break;
        default:
            command ="summon minecraft:display_block ~ ~1.5 ~ {";
    }
    switch (et) {
        case 'block_display':
            command += "block_state:{Name:\""+document.getElementById("block_id").value+"\"}";
            break;
        case 'item_display':
            var item_display_pov = document.getElementById("item_display_pov").value;
            command += "item:{id:\""+document.getElementById("item_id").value+"\",Count:1s}";
            if (item_display_pov =! "default") {command += ", item_display:" + item_display_pov;}
            break;
        case 'text_display':
            var text = document.getElementById("text_json").value;
            var text_alignment = document.getElementById("text_alignment").value;
            var line_length = document.getElementById("text_line_length").value;
            var default_bg = document.getElementById("text_default_background").checked;
            var text_shadow = document.getElementById("text_shadow").checked;
            var bg_color = document.getElementById("text_background_color").value.substring(1);
            var bg_alpha = document.getElementById("text_background_color_alpha").value;
            var text_opacity = +document.getElementById("text_opacity").value;
            if (text_opacity > 127) {text_opacity = 2*(text_opacity-128)-text_opacity}
            var see_through = document.getElementById("text_see_through").checked;
            text = text.replace(/\\/g,`\\\\`);
            text = text.replace(/"/g,`\\"`);
            command += "text:\""+text+"\""
            if (text_alignment != "center") {command += ", text_alignment:"+text_alignment;}
            if (line_length != 200) {command += ", line_width:" + line_length;}
            if (text_opacity != -1) {command += ", text_opacity:" + text_opacity;}
            if (see_through) {command += ", see_through: 1b";}
            if (text_shadow) {command += ", shadow: 1b";}
            if (default_bg == false) {
                if (bg_alpha > 127) {bg_alpha = 2*(bg_alpha-128)-bg_alpha};
                var alpha_hex = parseInt(bg_alpha).toString(16)
                bg_color = [alpha_hex,bg_color].join('');
                bg_color = parseInt(bg_color,16);
                if(bg_color != 1073741824) {command += ",background: " + bg_color.toString();}
            } else {
                command += ", default_background: 1b";
            }
            break;
        default:
            command += "block_state:{Name:\""+document.getElementById("block_id").value;+"\"},";
    }
    if (billboard != "default") {command = command + ",billboard:\""+billboard+"\"";}
    if(is_glowing == true) {command = command + ",Glowing:1b"};
    if (glow >= 0) {
        command = command + ",glow_color_override:"+glow;
    }
    command = `${command},interpolation_duration:${anim_duration},start_interpolation:0,transformation:[\
${Number(result[0][0]).toFixed(mtx_prc)}f, ${Number(result[0][1]).toFixed(mtx_prc)}f, ${Number(result[0][2]).toFixed(mtx_prc)}f,${Number(result[0][3]).toFixed(mtx_prc)}f,\
${Number(result[1][0]).toFixed(mtx_prc)}f, ${Number(result[1][1]).toFixed(mtx_prc)}f, ${Number(result[1][2]).toFixed(mtx_prc)}f,${Number(result[1][3]).toFixed(mtx_prc)}f,\
${Number(result[2][0]).toFixed(mtx_prc)}f, ${Number(result[2][1]).toFixed(mtx_prc)}f, ${Number(result[2][2]).toFixed(mtx_prc)}f,${Number(result[2][3]).toFixed(mtx_prc)}f,\
${Number(result[3][0]).toFixed(mtx_prc)}f, ${Number(result[3][1]).toFixed(mtx_prc)}f, ${Number(result[3][2]).toFixed(mtx_prc)}f,${Number(result[3][3]).toFixed(mtx_prc)}f\
]`;
    if (view_range != 1) {command = command + ",view_range:"+view_range+"f";}
    if (shadow_radius != 1) {command = command + ",shadow_radius:"+shadow_radius+"f";}
    if (shadow_strength != 1) {command = command + ",shadow_strength:"+shadow_strength+"f";}
    if (sky_light < 0 || isNaN(sky_light)) {sky_light = -1;}
    if (block_light < 0 || isNaN(block_light)) {sky_light = -1;}
    if (sky_light > 15) {sky_light = 15;}
    if (block_light > 15) {block_light = 15;}
    if (sky_light != -1 || block_light != -1) {
        if (sky_light == -1) {sky_light = 0;}
        if (block_light == -1) {block_light = 0;}
        command = command + ",brightness:{sky:"+sky_light+",block:"+block_light+"}"
    }
    document.getElementById("commandOutput").value = command +"}";
}

function generate_matrix(context) {
    //Get Rotation parameters
    var x_rot = document.getElementById("x_rotation").value
    var y_rot = document.getElementById("y_rotation").value
    var z_rot = document.getElementById("z_rotation").value
    //convert to Rad
    x_rot = x_rot / 180 * Math.PI
    y_rot = y_rot / 180 * Math.PI
    z_rot = z_rot / 180 * Math.PI
    //Get Shearing Parameters
    var x_shear = document.getElementById("x_shear").value;
    var y_shear = document.getElementById("y_shear").value;
    var z_shear = document.getElementById("z_shear").value;
    var x_shear_2 = document.getElementById("x_shear_2").value;
    var y_shear_2 = document.getElementById("y_shear_2").value;
    var z_shear_2 = document.getElementById("z_shear_2").value;
    //Get Scaling Parameters
    var x_scale = document.getElementById("x_scale").value;
    var y_scale = document.getElementById("y_scale").value;
    var z_scale = document.getElementById("z_scale").value;
    //Get Translation Parameters
    var x_offset = document.getElementById("x_translate").value;
    var y_offset = document.getElementById("y_translate").value;
    var z_offset = document.getElementById("z_translate").value;
    //Set Base Matrices
    var matrix_id = [[x_scale,0,0,0],[0,y_scale,0,0],[0,0,z_scale,0],[0,0,0,1]]
    var shear_matrix = [[1,x_shear,x_shear,0],[y_shear,1,y_shear,0],[z_shear,z_shear,1,0],[0,0,0,1]]
    var shear_matrix_2 = [[1,y_shear_2,z_shear_2,0],[x_shear_2,1,z_shear_2,0],[x_shear_2,y_shear_2,1,0],[0,0,0,1]]
    var rot_matrix_x =[[1,0,0,0],[0,Math.cos(x_rot),-Math.sin(x_rot),0],[0,Math.sin(x_rot),Math.cos(x_rot),0],[0,0,0,1]];
    var rot_matrix_y =[[Math.cos(y_rot),0,Math.sin(y_rot),0],[0,1,0,0],[-Math.sin(y_rot),0,Math.cos(y_rot),0],[0,0,0,1]];
    var rot_matrix_z = [[Math.cos(z_rot),-Math.sin(z_rot),0,0],[Math.sin(z_rot),Math.cos(z_rot),0,0],[0,0,1,0],[0,0,0,1]]
    var rot_matrix = multiply_matrix(rot_matrix_z,rot_matrix_y);
    rot_matrix = multiply_matrix(rot_matrix,rot_matrix_x);
    rot_matrix_x =[[1,0,0,0],[0,Math.cos(-x_rot),-Math.sin(-x_rot),0],[0,Math.sin(-x_rot),Math.cos(-x_rot),0],[0,0,0,1]];
    rot_matrix_z = [[Math.cos(-z_rot),-Math.sin(-z_rot),0,0],[Math.sin(-z_rot),Math.cos(-z_rot),0,0],[0,0,1,0],[0,0,0,1]]
    
    var result = multiply_matrix(matrix_id,shear_matrix);
    result = multiply_matrix(result,shear_matrix_2);
    result = multiply_matrix(result,rot_matrix);
    
    if (context == "game") {
        var x_center = document.getElementById('x_scale').value / 2;
        var y_center = -document.getElementById('y_scale').value / 2;
        var z_center = document.getElementById('z_scale').value / 2;
        var translate_matrix = [[1,0,0,document.getElementById('x_translate').value],[0,1,0,document.getElementById('y_translate').value],[0,0,1,document.getElementById('z_translate').value],[0,0,0,1]]
        var et = document.getElementById("entityType").value;
        if (et == "block_display") {
            var center_matrix = [[1,0,0,x_center],[0,1,0,y_center],[0,0,1,z_center],[0,0,0,1]];
            } else {
            var center_matrix = [[1,0,0,0],[0,1,0,y_center],[0,0,1,0],[0,0,0,1]];
            }
        var game_correction = [[-1,0,0,0],[0,1,0,0],[0,0,-1,0],[0,0,0,1]];
        result = multiply_matrix(matrix_id,game_correction);

        result = multiply_matrix(center_matrix,result);

        result = multiply_matrix(shear_matrix,result);
        result = multiply_matrix(shear_matrix_2,result);
        result = multiply_matrix(result,rot_matrix);

        result = multiply_matrix(translate_matrix,result);
        result = multiply_matrix(game_correction,result);
    }
    return result
}

function raw_to_json(text) {
    var json_text = "{\"text\":\""+text+"\",\"color\":\"#ffffff\"}";
    document.getElementById("text_json").value = json_text;
}

function modify_fields(type) {
    var fields = document.getElementsByClassName("switch");
    for (x=0; x <fields.length;x++) {
        fields[x].style.visibility = "hidden";
        fields[x].style.display = "none";
    }
    var fields = document.getElementsByClassName(type);
    for (x=0; x <fields.length;x++) {
        fields[x].style.visibility = "visible";
        fields[x].style.display = "inline-block";
    }
}

function multiply_matrix(m1,m2) {
fil_m1 = m1.length;  
col_m1 = m1[0].length;    
fil_m2 = m2.length;  
col_m2 = m2[0].length;
if (col_m1 != fil_m2)    
throw "Matrices cannot be multiplied";
let multiplication = new Array(fil_m1);  
for (x=0; x<multiplication.length;x++)      
multiplication[x] = new Array(col_m2).fill(0);
for (x=0; x < multiplication.length; x++) {      
for (y=0; y < multiplication[x].length; y++) {  
    for (z=0; z<col_m1; z++) {              
               multiplication [x][y] = multiplication [x][y] + m1[x][z]*m2[z][y];
               }      
    }  
}
return multiplication
}
function validate(item) {
    if (isNaN(item.value)) {item.value = Number(item.placeholder);}
    if (item.value < Number(item.min)) {item.value = Number(item.min);}
    if (item.value > Number(item.max)) {item.value = Number(item.max);}
}

function resetRotation() {
    document.getElementById('x_rotation').value=0;
    document.getElementById('y_rotation').value=0;
    document.getElementById('z_rotation').value=0;
    transform();
    document.getElementById('x_rot_val').innerHTML='0°';
    document.getElementById('y_rot_val').innerHTML='0°';
    document.getElementById('z_rot_val').innerHTML='0°';
}
function resetShear() {
    document.getElementById('x_shear').value=0;
    document.getElementById('y_shear').value=0;
    document.getElementById('z_shear').value=0;
    document.getElementById('x_shear_2').value=0;
    document.getElementById('y_shear_2').value=0;
    document.getElementById('z_shear_2').value=0;
    transform();
}
function rotationStep(val) {
    document.getElementById('x_rotation').step = val;
    document.getElementById('y_rotation').step = val;
    document.getElementById('z_rotation').step = val;
}

function resetScale() {
    document.getElementById('x_scale').value=1;
    document.getElementById('y_scale').value=1;
    document.getElementById('z_scale').value=1;
    transform();
}
function resetTranslation() {
    document.getElementById('x_translate').value=0;
    document.getElementById('y_translate').value=0;
    document.getElementById('z_translate').value=0;
    transform();
}
function center() {
    document.getElementById('x_translate').value= -document.getElementById('x_scale').value / 2;
    document.getElementById('y_translate').value= -document.getElementById('y_scale').value / 2;
    document.getElementById('z_translate').value= -document.getElementById('z_scale').value / 2;
    transform();
}
function copyToClipboard() {
  var copyText = document.getElementById("commandOutput");
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(copyText.value);
} 
