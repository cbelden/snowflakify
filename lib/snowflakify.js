var Snowflakify = (function() {
    /* Global parameters */
    var THETA = 45;

    var Snowflake = function(options) {
        options = options || {};
        this.x = options.x || 400;
        this.y = options.y || 0;
        this.velocity = [0, 1];
        this.rotation = (Math.random() - 0.5)*180;
        this.rotVelocity = Math.random() - 0.5;
        this.image = new Image();
        this.image.src = options.imageUrl || '';
        this.time = null;
        this.velocityScalar = options.speed ? options.speed/100*0.12 : 0.06;
        this.rotVelocityScalar = options.rotation ? options.rotation/100*0.4 : 0.2;
    };

    _.assign(Snowflake.prototype, {
        updatePosition: function(canvas, t) {
            // Get the time since the last animation
            var deltaT = this.time ? t - this.time : 0;
            this.time = t;

            // Update x and y
            this.x += this.velocity[0]*deltaT*this.velocityScalar;
            this.y += this.velocity[1]*deltaT*this.velocityScalar;

            // Update the rotation
            this.rotation += this.rotVelocity*deltaT*this.rotVelocityScalar;

            // Move any snowflakes outside of the viewport to the opposite side.
            this.teleport('x', -100, canvas.width+100);
            this.teleport('y', -100, canvas.height+100);

            // Tweak the direction (will randomize the snowflake's path)
            this.updateDirection();
        },

        teleport: function(prop, min, max) {
            this[prop] = ((this[prop] - min) % (max - min)) + min;
        },

        updateDirection: function() {
            var theta, mag;

            // Update the velocity direction.
            // Note: animation seems to look better when the y-velocity is not updated.
            this.velocity[0] += (Math.random() - 0.5)/100;

            // Increase y-velocity if theta is too large, where theta is the angle between the
            // velocity and vertical. This will help the flakes to have a mostly downward velocity.
            theta = Math.acos(this.magnitude(this.velocity)/this.x);
            if (theta > THETA/180*Math.PI)
            {
                this.velocity[1] += this.velocity[1]*0.1;
            }

            // Ensure speed remains the same
            mag = this.magnitude(this.velocity);
            this.velocity = [this.velocity[0]/mag, this.velocity[1]/mag];
        },

        draw: function(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation*Math.PI/180);
            ctx.drawImage(this.image, 0, 0);
            ctx.restore();
        },

        updateAndDraw: function(canvas, ctx, t) {
            this.updatePosition(canvas, t);
            this.draw(ctx);
        },

        magnitude: function(v) {
            return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
        }
    });

    return {
        initialize: function(options) {
            opts = options || {};
            this.noFlakes = opts.density || 40;
            this.flakeSpeed = opts.speed || 50;
            this.flakeRotation = opts.rotation || 50;
            this.opacity = options.opacity/100 || 1;

            // Get canvas/context
            this.canvas = this.getCanvas();
            this.context = this.canvas.getContext('2d');

            // Create the snowflakes
            this.flakes = this.createSnowflakes(this.noFlakes);
        },

        animate: function(t) {
            // Ensure canvas is present
            this.canvas  || (this.canvas = this.getCanvas());
            this.context || (this.context = this.canvas.getContext('2d'));

            // Ensure flakes have been created
            this.flakes || (this.flakes = this.createSnowflakes(this.noFlakes));

            // Clear the canvas
            this.canvas.width = this.canvas.width;

            // Update each snowflake
            _.each(this.flakes, (function(flake) {
                flake.updateAndDraw(this.canvas, this.context, t);
            }).bind(this));
        },

        getCanvas: function() {
            // Return canvas if already present in DOM
            var canvas = document.getElementById('snowflakify');
            if (canvas) return canvas;

            // Create and prepare new canvas
            canvas = document.createElement('canvas');
            canvas.id = 'snowflakify';
            canvas.style.opacity = this.opacity;
            document.body.insertBefore(canvas, document.body.firstChild);
            this.resize(canvas);
            return canvas;
        },

        createSnowflakes: function(n) {
            var flakes = [],
                flake,
                i = 0;

            for (i; i < n; i++) {
                flake = {
                    x: i/n*this.canvas.width,
                    y: Math.random()*(this.canvas.height+200) - 100,
                    imageUrl: opts.imageUrl,
                    speed: this.flakeSpeed,
                    rotation: this.flakeRotation,
                };

                flakes.push(new Snowflake(flake));
            }

            return flakes;
        },

        cancelAnimation: function() {
            // Remove canvas element. User may have cancelled the animation because the canvas element
            // broke a web page she was visiting; we should accomodate this use case.
            this.canvas.parentElement.removeChild(this.canvas);

            // Set canvas/context/flakes to null. This will force us to recreate the canvas element
            // if the animation is toggled again. Setting the flakes to null will cause the flakes
            // to fill the current window if the size has changed since cancelling the animation.
            this.canvas = this.context = this.flakes = null;
        },

        resize: function(canvas) {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        },
    };
})();
