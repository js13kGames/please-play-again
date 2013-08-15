var middle = 150;

require([], function() {
	var Pattern = function(distances) {
		this.scroll = 0;
		this.distances = distances;
	};

	Pattern.prototype = {
		draw: function(ctx) {
			ctx.lineWidth = 3;
			ctx.fillStyle = "black";
			ctx.strokeStyle = "white";

			var i = 0, x = -this.scroll, y;
			ctx.beginPath();
			ctx.moveTo(0, middle);
			ctx.lineTo(1000, middle);

			ctx.moveTo(this.scroll, middle);
			for (; i < this.distances.length; i++) {
				x += this.distances[i];
				y = middle;
				ctx.moveTo(x, y);
				ctx.arc(x, y, 25, 0, Math.PI * 2);
			} 
			ctx.stroke();
			ctx.fill();
		},
		tick: function(t) {
			this.scroll += t / 3;
			this.scroll %= 1000;
		}
	};

	var Thing = function() {
		this.time = 0;
		this.nudged = 0;
		this.v = 0;
	};

	Thing.prototype = {
		draw: function(ctx) {
			ctx.fillStyle = "white";
			ctx.beginPath();
			x =  300;
			y =  middle + this.nudged * 5;
			ctx.moveTo(x + 10, y)
			ctx.arc(x, y, 10, 0, Math.PI * 2);
			ctx.fill();
		},
		tick: function(t) {
			var sign = (this.nudged > 0) ? 1 : -1;
			if (Math.abs(this.nudged) > 30) {
				this.nudged = 30 * sign;
			}

			this.v -=  sign * 9 / 1000 * t;
			this.v *= 1.0 - (0.9 / 1000 * t);
			if (Math.abs(this.nudged) < 1 && Math.abs(this.v) < 3 / t) {
				this.v = 0;
				this.nudged = 0;
			}
			this.nudged  += this.v;

			if (Math.abs(this.nudged) > 30) {
				this.nudged = 30 * sign;
			}
		},
		nudge: function() {
			this.v -= 3;
		},
	};

	$(document).ready(function() {
		var p = new Pattern([1000, 2090, 3000]);
			f = new Thing(),
			canvas = $('#c')[0],
			ctx = canvas.getContext('2d'),
			loop = function() {
				p.tick(1000/60);
				f.tick(1000/60);
				ctx.clearRect(0, 0,	canvas.width, canvas.height);
				p.draw(ctx);
				f.draw(ctx);
				setTimeout(loop, 1000/60);
			};

			$('body')[0].onkeydown = function(e) {
				var key = e.keyCode || e.which;
				if (key == 0x26) {
					f.nudge();
				}
			};

			loop();
	});
});
