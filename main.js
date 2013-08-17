var middle = 150,
	light_blue = "#40FFE0",
	grey = "#999285",
	yellowy = "#F7B019",
	orange = "#FF6E00",
	green = "#14C77A"
;

require([], function() {
	var Seq = function(objs, ongone) {
		this.ongone = ongone;
		this.objs = objs;
		this.hit = 0;
		this.x = 1000;

		/* each object has an x value, which we consider to be its
			offset from the previous object.
		*/
		var x = 0;
		objs.forEach(function(o) {
			x += o.x;
			o.x0 = x;
			x += o.w;
			o.seq = this;
		}, this);

		this.w = x;
	};

	Seq.prototype.tick = function(t) {
		this.x -= t / 1000 * 200;

		if (this.w + this.x < 0)
			this.gone();
	};

	Seq.prototype.draw = function(ctx) {
		this.objs.forEach(function(o) {
			o.x = o.x0 + this.x;
			o.draw(ctx);
		}, this);
	};

	Seq.prototype.checkHit = function(avatar) {
		this.remaining = 0;
		this.objs.forEach(function(o) {
			if (o.checkHit(avatar) === false) {
				this.remaining++;
			}
		}, this);
	};

	Seq.prototype.gone = function() {
		if (this.remaining <= 0) {
			if (this.ongone) {
				this.ongone(true);
			}
		} else {
			if (this.ongone && !this.ongone(false)) {
				this.x = 1000;
				this.objs.forEach(function(o) {
					o.hit = false;
				});
			}
		}
	};

	var Text = function(x, value, ctx) {
		this.x = x;
		this.s = value;
		this.style(ctx);
		this.w = ctx.measureText(value).width;
	};
	Text.prototype = {
		checkHit: function(){},
		style: function(ctx) {
			ctx.font = "40px sans-serif";
			ctx.fillStyle = grey;
		},
		draw: function(ctx) {
			this.style(ctx);
			ctx.fillText(this.s, this.x, middle - 25);
		},
	};


	var Ball = function(x, h) {
		this.w = 50;
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
		return this.hit;
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
			ctx.moveTo(x + 10, y);
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
		var canvas = $('#c')[0],
			ctx = canvas.getContext('2d'),
			advance = function(done, slide) {
				if (done) seqs.shift();
				else return done;
			},
			seqs = [new Seq([
						new Ball(0, 0),
						new Text(100, "down", ctx),
						new Ball(60, 2),
						new Ball(60, -2.5)],
						advance),
					new Seq([
						new Text(100, 'all done', ctx)])
					],
			player = new Thing(),
			loop = function() {
				if (seqs.length === 0)
					return;
				setTimeout(loop, 1000/60);
				var s = seqs[0];
				player.tick(1000/60);
				s.tick(1000/60);
				s.checkHit(player);
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
