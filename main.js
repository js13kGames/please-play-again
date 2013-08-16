var middle = 150
	,light_blue = "#40FFE0"
	,grey = "#999285"
	,yellowy = "#F7B019"
	,orange = "#FF6E00"
	,green = "#14C77A"
;

require([], function() {
	var Ball = function(x, h) {
		this.x = x;
		this.y = middle + h * 30;
		this.hit = false;
	};

	Ball.prototype.checkHit = function(avatar) {
		// TODO: Don't leak logic like this
		var x =  300, y =  middle + avatar.nudged * 5,
			dx = x - this.x, dy = y - this.y;
		if (Math.sqrt(dx * dx + dy * dy) < 30) {
			this.hit = true;
		}
	};

	Ball.prototype.draw = function(ctx) {
		var x = this.x, y = this.y;
		ctx.fillStyle = this.hit ? green : "white";
		ctx.beginPath();
		ctx.moveTo(x + 25, y);
		ctx.arc(x, y, 25, 0, Math.PI * 2);
		ctx.fill();
		/* IFDEF DEBUG
		ctx.strokeStyle = "blue";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(x, y);
		ctx.stroke();
		*/
	};

	var Slide = function(objs) {
		this.objs = [];
		this.add(objs);
	};

	Slide.prototype = {
		draw: function(ctx) {
			ctx.lineWidth = 3;
			ctx.fillStyle = "black";
			ctx.strokeStyle = "white";

			this.objs.forEach(function(o) {
				o.draw(ctx);
			});
		},
		tick: function(t) {
			var offscreen = 0;
			this.objs.forEach(function(o) {
				o.x -= t / 1000 * 200;
				if (o.x <= -60) {
					offscreen++;
				}
			});

			this.objs = this.objs.slice(offscreen);
		},
		add: function(addme) {
			var xs = this.objs.map(function(o) { return o.x; });
			xs.push(1000);
			var offset = Math.max.apply(null, xs);
			addme.forEach(function(o) {
				o.x += offset;
				this.objs.push(o);
			}, this);
		},
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
		nudge: function(sign) {
			this.v -=  sign * 2;
		},
	};

	$(document).ready(function() {
		var s = new Slide([new Ball(0, 0), new Ball(60, 2)]),
			player = new Thing(),
			canvas = $('#c')[0],
			ctx = canvas.getContext('2d'),
			loop = function() {
				setTimeout(loop, 1000/60);
				s.tick(1000/60);
				player.tick(1000/60);
				s.objs.forEach(function(o) {
					o.checkHit(player);
				});
				ctx.clearRect(0, 0,	canvas.width, canvas.height);
				s.draw(ctx);
				player.draw(ctx);
			};

			$('body')[0].onkeydown = function(e) {
				var key = e.keyCode || e.which;
				if (key == 0x26) {
					player.nudge(1);
				} else if (key == 0x28) {
					player.nudge(-1);
				}
			};

			loop();
	});
});
