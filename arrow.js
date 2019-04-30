/* global AFRAME THREE */

if (typeof AFRAME === "undefined") {
    throw "Component attempted to register before AFRAME was available.";
}

AFRAME.registerComponent("arrow", {
    schema: {
        direction: {
            type: "vec3",
            default: {
                x: 1,
                y: 0,
                z: 0
            }
        },
        length: {
            type: "number"
        },
        color: {
            type: "color",
            default: "#ff0"
        },
        headLength: {
            type: "number"
        },
        headWidth: {
            type: "number"
        }
    },
    init: function () {
        var data = this.data;
        var direction = new THREE.Vector3(data.direction.x, data.direction.y, data.direction.z);
        var length = data.length || direction.length();
        var headLength = data.headLength || length * .2;
        var headWidth = data.headWidth || headLength * .2;
        var color = new THREE.Color(data.color);

        this.lineMaterial = new THREE.LineBasicMaterial( {
            color: 0x0,
            linewidth: 4,   
            linecap: 'round', //ignored by WebGLRenderer
            linejoin:  'round' //ignored by WebGLRenderer
        } );
        var diffuseColor = new THREE.Color().setHSL( .5, 0.5, 0.5 );
		this.material = new THREE.MeshPhysicalMaterial( {
									color: diffuseColor,
									metalness: 0.6,
                                    roughness: 1,
                                    flatShading: true,
									clearCoat: 1.0 - 1.0,
									clearCoatRoughness: 1.0 - 1.0,
									reflectivity: 1.0 - .5
		} );


        this.arrow = new THREE.ArrowHelper(direction.normalize(), new THREE.Vector3(), length, color, headLength, headWidth);
        this.geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
        this.arrow.line.material = this.lineMaterial;
        this.arrow.cone.material = this.material;
        this.mesh = new THREE.Mesh(this.arrow.geometry,this.material);
        this.el.setObject3D("arrow", this.arrow);


    },
    update: function (oldData) {
        var data = this.data;
        var diff = AFRAME.utils.diff(data, oldData);
        if ("color" in diff) {
           // this.arrow.setColor(new THREE.Color(data.color));
        }
        var length;
        if ("direction" in diff) {
            var direction = new THREE.Vector3(data.direction.x, data.direction.y, data.direction.z);
            length = direction.length();
            this.arrow.setDirection(direction.normalize());
        }
        if ("headLength" in diff && typeof data.length === "undefined" || "length" in diff || "headLength" in diff || "headWidth" in diff) {
            length = data.length || length;
            var headLength = data.headLength || length * .2;
            var headWidth = data.headWidth || headLength * .2;
            var data = this.data;
        var direction = new THREE.Vector3(data.direction.x, data.direction.y, data.direction.z);
        var length = data.length || direction.length();
        var headLength = data.headLength || length * .2;
        var headWidth = data.headWidth || headLength * .2;
        var color = new THREE.Color(data.color);

           
        this.lineMaterial = new THREE.LineBasicMaterial( {
            color: 0x0,
            linewidth: 4,   
            linecap: 'round', //ignored by WebGLRenderer
            linejoin:  'round' //ignored by WebGLRenderer
        } );
        var diffuseColor = new THREE.Color().setHSL( .5, 0.5, 0.5 );
		this.material = new THREE.MeshPhysicalMaterial( {
									color: diffuseColor,
									metalness: 0.6,
                                    roughness: 1,
                                    flatShading: true,
									clearCoat: 1.0 - 1.0,
									clearCoatRoughness: 1.0 - 1.0,
									reflectivity: 1.0 - .5
		} );


        this.arrow = new THREE.ArrowHelper(direction.normalize(), new THREE.Vector3(), length, color, headLength, headWidth);
        this.geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
        this.arrow.line.material = this.lineMaterial;
        this.arrow.cone.material = this.material;
        this.mesh = new THREE.Mesh(this.arrow.geometry,this.material);
        this.el.setObject3D("arrow", this.arrow);
        }
    },remove: function () {
        this.el.removeObject3D("arrow");
    }
});
