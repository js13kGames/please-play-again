var middle = 150,
	light_blue = "#40FFE0",
	grey = "#999285",
	yellowy = "#F7B019",
	orange = "#FF6E00",
	green = "#14C77A"
;

_ = {
	extend: function(a, b) {
		Object.keys(b).forEach(function(k) {
			a[k] = b[k];
		});
	}
};

var Seq = function(title, objs, ongone, props) {
	this.title = title;
	this.finished = false;
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
	if (props) {
		_.extend(this, props);
	}
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
			this.finished = true;
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

var Ball = function(x, h) {
	this.w = 50;
	this.x = x;
	this.y = middle + h * 30;
	this.hit = false;
};

Ball.prototype.checkHit = function(avatar) {
	// TODO: Don't leak logic like this
	var x =  300, y =  middle + avatar.nudged * 6,
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
		y =  middle + this.nudged * 6;
		ctx.moveTo(x + 10, y);
		ctx.arc(x, y, 10, 0, Math.PI * 2);
		ctx.fill();
	},
	tick: function(t) {
		var sign = (this.nudged > 0) ? 1 : -1;
		this.v -=  sign * 9 / 1000 * t;
		this.v *= 1.0 - (0.9 / 1000 * t);
		if (Math.abs(this.nudged) < 1 && Math.abs(this.v) < 3 / t) {
			this.v = 0;
			this.nudged = 0;
		}
		this.nudged  += this.v;

		if (Math.abs(this.nudged) > 25) {
			this.nudged = 25 * sign;
		}
	},
	nudge: function(sign) {
		this.v -=  sign * 2;
	},
};

var Game = function() {
	var canvas = document.getElementById('c'),
		self = this;
	this.w = canvas.width;
	this.h = canvas.height;
	this.ctx = canvas.getContext('2d');
	this.seq = 0;
	var advance = function(done) {
		if (done) self.nextSeq();
		else return done;
	};
	this.progress = document.getElementById("progress");
	this.title = document.getElementById("title");
	this.player = new Thing();

	document.getElementsByTagName('body')[0].onkeydown = function(e) {
			var key = e.keyCode || e.which;
			if (key == 0x26) {
				self.player.nudge(1);
			} else if (key == 0x28) {
				self.player.nudge(-1);
			}
	};

	this.seqs = [new Seq("tap up", [
					new Ball(0, 0),
					new Ball(260, 2),
					new Ball(90, -2.5),
					],
				advance),
				new Seq("you don't know what you're doing",
					[new Ball(0, 0),
					new Ball(90, 3),
					new Ball(160, 3),
					new Ball(30, 0),
					new Ball(190, 0)],
					advance),
				new Seq("wanting isn't enough", [
					new Ball(0, 5),
					new Ball(-60, -5),
					new Ball(60, 5),
					new Ball(-60, -5),
					new Ball(140, -2),
					new Ball(0, -2),
					],
					function(done) {
						if (++this.tries >= 2) {
							this.tries = 0;
							advance(true);
						} else {
							return done;
						}
					}, {tries:0}),
				new Seq("stopping can be harder than starting", [
					new Ball(0, 2),
					new Ball(90, -2.5),
					new Ball(80, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					],
					advance)];
};

Game.prototype = {
	nextSeq: function() {
		++this.seq;
		if (this.seq >= this.seqs.length)
			this.finished = true;
		this.updatePosition();
	},

	updatePosition: function() {
		var result = [], type;
		for (var i = 0; i < this.seqs.length; i++) {
			type = this.seqs[i].finished ? "finished" : "unfinished";
			if (i == this.seq) {
				type = "current";	
				this.title.innerHTML = this.seqs[i].title;
			}
			result.push('<span class="', type, '">&#5603;</span>');
		}
		this.progress.innerHTML = result.join("");
	},

	update: function(t) {
		var s = this.seqs[this.seq];
		this.player.tick(1000/60);
		s.tick(1000/60);
		s.checkHit(this.player);
		this.ctx.clearRect(0, 0, this.w, this.h);
		s.draw(this.ctx);
		this.player.draw(this.ctx);
	},
};

window.onload = function() {
		var game = new Game(),
		loop = function() {
			if (!game.finished) {
				setTimeout(loop, 1000/60);
				game.update(1000/60);
			}
		};

		game.updatePosition();
		loop();
};
