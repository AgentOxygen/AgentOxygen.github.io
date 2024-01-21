var canvas = document.getElementById('canvas', willReadFrequently=true);
var ctx = canvas.getContext('2d', { willReadFrequently: true });
var frame_delay = 1000; // Time in seconds between frames
var num_stripes = hw_data[0].length;
var time_since_last_frame = 0;
var frame_index = randomInt(0, num_stripes);
var interval = 0;
var time_index = 0;
var stripe_speed = 2500;
var lastRender = 0;

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function perc2color(val) {
	var min = 0;
	var max = 130;
	
	var r, g, b = 0;
	var percentage = val / (max - min);
	/** bwr color scheme
	if (percentage > 0.5) {
		let upper_perc = (1 - percentage) / 0.5;
		
		r = 255;
		g = Math.round(255*upper_perc);
		b = Math.round(255*upper_perc);
	}else {
		let lower_perc = ((0.5 + percentage) / 0.5) - 1;
		r = Math.round(255*lower_perc);
		g = Math.round(255*lower_perc);
		b = 255;
	}*/
	r = 255;
	g = Math.round(255*(1-percentage));
	b = Math.round(150*(1-percentage));
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fitCanvas() {
	sources = [];
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function draw(progress) {
	time_since_last_frame += progress;
	let frame_progress = time_since_last_frame/frame_delay;
	
	if (frame_progress > 1){
		frame_progress = 1;
	}
	
	if (time_since_last_frame >= frame_delay) {
		frame_index += 1;
		if (frame_index >= num_stripes){
			frame_index = 0;
		}
		time_since_last_frame = 0;
		frame_progress = 0;
	}
	
	let next_frame = frame_index + 1;
	if (next_frame >= num_stripes) {
		next_frame = 0;
	}
	
	interval += progress;
	if (interval >= stripe_speed){
		time_index += 1;
		if (time_index >= hw_data.length) {
			time_index = 0;
		}
		interval = 0;
	}
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw
	for (let i = 0; i < num_stripes; i++){
		let val = 0;
		if (time_index + 1 < hw_data.length) {
			val = (hw_data[time_index + 1][i] - hw_data[time_index][i]) * (interval / stripe_speed) + hw_data[time_index][i];
		} else {
			val = (hw_data[0][i] - hw_data[time_index][i]) * (interval / stripe_speed) + hw_data[time_index][i];
		}
		
		ctx.fillStyle = perc2color(val);
		ctx.fillRect((window.innerWidth / num_stripes)*i, 0, (window.innerWidth / num_stripes), window.innerHeight);
	}

}

function loop(timestamp) {
	var progress = timestamp - lastRender;
	
	draw(progress);
	
	lastRender = timestamp;
	window.requestAnimationFrame(loop);
}

window.addEventListener('resize', fitCanvas, false);
fitCanvas();
window.requestAnimationFrame(loop);