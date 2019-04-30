

AFRAME.registerSystem('sequence-system', {
   
    init: function () {
        this.feedback = null;
        this.feedbackCountDown = 0;
        this.feedbackText = "";
        this.yesButtons = [];
        this.noButtons = [];
        this.slideDict = {}; //key is slide index and value is array of 'slide' objects that correspond to the key
        this.slideAnswers = {};
        this.sequenceLength = 0;
        this.currentSlide = 0;
        this.firstUpdate = true;
        this.yesClick = AFRAME.utils.bind(this.yesClick,this);
        this.el.addEventListener('yesClick',this.yesClick);
        this.updateState = AFRAME.utils.bind(this.updateState,this);
        this.el.addEventListener('loaded',this.updateState);
       
    },
    


 
    yesClick:function(){
        
        if(this.slideAnswers[this.currentSlide] == true){
            this.feedbackText = "correct!";
            this.currentSlide = (this.currentSlide +1) % (this.sequenceLength);
        }else{
            this.feedbackText = "wrong!";
        }
        this.feedbackCountDown = 3;
        
        this.updateState();
    },

    noClick:function(){
        if(this.slideAnswers[this.currentSlide] != true){
            this.feedbackText = "correct!";
            this.currentSlide = (this.currentSlide +1) % (this.sequenceLength);
        }else{
            this.feedbackText = "wrong!";
        }
        this.feedbackCountDown = 3;        
        this.updateState();
    },
    
   
    updateState: function(){
        for (var property in this.slideDict) {
            if (this.slideDict.hasOwnProperty(property)) {
                var array = this.slideDict[property];
                var i;
                var startIndex = parseInt(property);
                for(i = 0; i < array.length; i++){
                    var objectDuration = array[i][1];
                    var objectHideIndex = startIndex + objectDuration;
                    if((this.currentSlide >= startIndex) && (this.currentSlide < objectHideIndex)){
                        array[i][0].setAttribute("visible",true);
                    }else{
                        array[i][0].setAttribute("visible",false);
                    }
                    
                }
            }
        }
        this.feedback.setAttribute('text','value: '+this.feedbackText);
        var secondCameraEl = document.querySelector('#cameraRig');
        secondCameraEl.setAttribute('camera', 'active', true);
    },
    registerMe: function (data,el) {
        if(data.isYes){
            this.yesButtons.push(el);
        }else if(data.isNo){
            this.noButtons.push(el);
        }
        if(data.isSlide){
            //if we already have slide index, just push it to the slide index
            if(this.slideDict.hasOwnProperty(data.slideIndex)){
                this.slideDict[data.slideIndex].push([el,data.slideDuration]);
            }else{
                this.slideDict[data.slideIndex] = [[el,data.slideDuration]];
            }
        }else if(data.isFeedback){
            this.feedback = el;
        }
        if(data.isSlideConstructor){
            
            this.slideAnswers[data.slideIndex] = data.isCorrect;
        }
        if(data.isSequenceConstructor){
            //Make sure that we didnt already initiate sequence
            console.assert(this.sequenceLength > 0 ,"WARNING, CAN ONLY HAVE ONE SEQUENCE CONSTRUCTOR IN SYSTEM");
            this.sequenceLength = data.sequenceLength;
        }
    },
  
    unregisterMe: function (el) {
      
    }
  });
  
  AFRAME.registerComponent('sequence-system', {
    schema: {
        isYes: {type: 'boolean', default: false},
        isNo: {type: 'boolean', default: false},
        isSlide: {type: 'boolean', default: false},
        slideIndex:{type: 'number', default: 0},
        slideDuration:{type: 'number',default:1},
        isSlideConstructor:{type:'boolean', default:false},
        isCorrect:{type: 'boolean', default: false},
        isSequenceConstructor:{type: 'boolean', default: false},
        sequenceLength: {type: 'number', default: 5},
        isFeedback:{type:'boolean', default:false}

        
    },

    clicked: function(isYes){
        
        
    },
    init: function () {
       

        this.system.registerMe(this.data,this.el);
        if(this.data.isYes){
            this.clicked =AFRAME.utils.bind(this.system.yesClick,this.system);
            this.el.addEventListener('click', this.clicked);
            this.el.classList.toggle('clickable');
        }else if(this.data.isNo){
            this.clicked = AFRAME.utils.bind(this.system.noClick,this.system);
            this.el.addEventListener('click', this.clicked);
            this.el.classList.toggle('clickable');
        }
          

          
    },


  
    remove: function () {
      this.system.unregisterMe(this.el);
    }
  });
