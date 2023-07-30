const full_url = window.location.href;
const base_url = full_url.split("#")[0];
const page = full_url.split("#")[1];


function changePage(page_id) {
	
	document.getElementById('info_section').style.display = "none";
	document.getElementById('projects_section').style.display = "none";
	document.getElementById('resume_section').style.display = "none";
	document.getElementById('contact_section').style.display = "none";
	
	switch(page_id) {
		case 'info':
			document.getElementById('info_section').style.display = "block";
			
			window.history.pushState({}, "Cameron Cummins", base_url + "#info");
			break;
		case 'projects':
			document.getElementById('projects_section').style.display = "block";
			
			window.history.pushState({}, "Cameron Cummins", base_url + "#projects");
			console.log(document.getElementById('projects_btn'));
			break;
		case 'resume':
			document.getElementById('resume_section').style.display = "block";
			window.history.pushState({}, "Cameron Cummins", base_url + "#resume");
			break;
		case 'contact':
			document.getElementById('contact_section').style.display = "block";
			window.history.pushState({}, "Cameron Cummins", base_url + "#contact");
			break;
		default:
			document.getElementById('info_section').style.display = "block";
			window.history.pushState({}, "Cameron Cummins", base_url + "#info");
	}
}
changePage(page);

var canvas = document.getElementById('canvas', willReadFrequently=true);
var ctx = canvas.getContext('2d', { willReadFrequently: true });

var flow_time_length = flow_vector_field.length;
var flow_lon_length = flow_vector_field[0].length;
var flow_lat_length = flow_vector_field[0][0].length;

var x_ratio = flow_lon_length / (window.innerWidth - 25);
var y_ratio = flow_lat_length / (window.innerHeight - 25);

console.log([flow_time_length, flow_lon_length, flow_lat_length]);

var frame_delay = 1000; // Time in seconds between frames

var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function visualize_field(frame_index, next_frame, frame_progress, x, y){
	/* Guide Matrix
	[ 0 1 2 ]
	[ 3 4 5 ]
	[ 6 7 8 ]
	*/
	
	let cx = Math.floor(x*x_ratio);
	let cy = Math.floor(y*y_ratio);
	
	if (cx - x*x_ratio > 0.5 && cx + 1 < flow_vector_field[frame_index].length){
		cx += 1
	}
	if (cy - y*y_ratio > 0.5 && cy + 1 < flow_vector_field[frame_index][0].length){
		cy += 1
	}
	
	let center = flow_vector_field[frame_index][cx][cy];
	let first_img = [center, center, center, center, center, center, center, center, center];
	
	let center2 = flow_vector_field[next_frame][cx][cy];
	let second_img = [center2, center2, center2, center2, center2, center2, center2, center2, center2];
	
	let up = false;
	let down = false;
	let left = false;
	let right = false;
	
	if ((cx + 1) < flow_vector_field[frame_index].length) {
		right = true;
		first_img[5] = flow_vector_field[frame_index][cx+1][cy];
		second_img[5] = flow_vector_field[next_frame][cx+1][cy];
	}
	if ((cx - 1) >= 0) {
		left = true;
		first_img[3] = flow_vector_field[frame_index][cx-1][cy];
		second_img[3] = flow_vector_field[next_frame][cx-1][cy];
	}
	if ((cy + 1) >= flow_vector_field[frame_index][0].length) {
		up = true;
		first_img[1] = flow_vector_field[frame_index][cx][cy+1];
		second_img[1] = flow_vector_field[next_frame][cx][cy+1];
	}
	if ((cy - 1) >= 0) {
		down = true;
		first_img[7] = flow_vector_field[frame_index][cx][cy-1];
		second_img[7] = flow_vector_field[next_frame][cx][cy-1];
	}
	if (up && left){
		first_img[0] = flow_vector_field[frame_index][cx-1][cy+1];
		second_img[0] = flow_vector_field[next_frame][cx-1][cy+1];
	}
	if (up && right){
		first_img[2] = flow_vector_field[frame_index][cx+1][cy+1];
		second_img[2] = flow_vector_field[next_frame][cx+1][cy+1];
	}
	if (down && left){
		first_img[6] = flow_vector_field[frame_index][cx-1][cy-1];
		second_img[6] = flow_vector_field[next_frame][cx-1][cy-1];
	}
	if (down && right){
		first_img[8] = flow_vector_field[frame_index][cx+1][cy-1];
		second_img[8] = flow_vector_field[next_frame][cx+1][cy-1];
	}
	
	let summation = 0;
	for (let index = 0; index < first_img.length; index += 1){
		summation = first_img[index] + ((second_img[index] - first_img[index])*frame_progress);
	}
	let mean = summation / first_img.length;
	
	return mean;
}

function fitCanvas() {
	sources = [];
	
	canvas.width = window.innerWidth - 25;
	canvas.height = window.innerHeight - 25;
	
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	x_ratio = flow_lon_length / (window.innerWidth - 25);
	y_ratio = flow_lat_length / (window.innerHeight - 25);
}

window.addEventListener('resize', fitCanvas, false);
fitCanvas();

var time_since_last_frame = 0;
var frame_index = randomInt(0, flow_time_length);

function draw(progress) {
	time_since_last_frame += progress;
	let frame_progress = time_since_last_frame/frame_delay;
	
	if (frame_progress > 1){
		frame_progress = 1;
	}
	
	if (time_since_last_frame >= frame_delay) {
		frame_index += 1;
		if (frame_index >= flow_time_length){
			frame_index = 0;
		}
		time_since_last_frame = 0;
		frame_progress = 0;
	}
	
	let next_frame = frame_index + 1;
	if (next_frame >= flow_time_length) {
		next_frame = 0;
	}
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//
	//  Draw dots from data
	//
	
	ctx.globalAlpha = 0.25;
	let spacing = 30;
	let num_rows = Math.floor(canvas.height / spacing);
	let num_cols = Math.floor(canvas.width / spacing);
	let dx = canvas.width / num_cols;
	let dy = canvas.height / num_rows;
	let x = spacing;
	let y = spacing;
	
	for(var i = 0; i < num_cols && x < canvas.width - spacing; i += 1){
		for(var j = 0; j < num_rows && y < canvas.height - spacing; j += 1){
			let radius = visualize_field(frame_index, next_frame, frame_progress, x, y);

			ctx.beginPath();
			ctx.arc((i+1)*spacing, (j+1)*spacing, radius, 0, 2 * Math.PI);
			ctx.fill();
			
			y += dy;
		}
		x += dx;
		y = spacing;
	}
}

function loop(timestamp) {
	var progress = timestamp - lastRender;
	
	draw(progress);
	
	lastRender = timestamp;
	window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);

console.log("Visualization script loaded.");