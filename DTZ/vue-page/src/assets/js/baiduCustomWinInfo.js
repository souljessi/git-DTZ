  let CustomInfo = (point, map, content, options = {}) => {
    this.point = point;
    this.map = map;
    this.content = content || '文本'
    this.divOptions = {
      width: options.width || 160,
      // height: options.height || 100,
      position: options.position || 'absolute',
      Zindex: options.Zindex || 999,
      cursor: options.cursor || 'default',
      backgroundColor: options.backgroundColor || 'rgb(255, 255, 255)',
      margin: 0,
      padding: 0,
      textAlign: options.textAlign || 'center',
      color: options.color || '#4c4c4c',
      fontSize: options.fontSize || '14px',
      fontWeight: options.fontWeight || 700,
      whiteSpace: options.whiteSpace || 'normal',
      boxSizing: options.boxSizing || 'border-box',
      boxShadow: options.boxShadow || '1px 2px 1px rgba(0,0,0,.15)'
    }
  }

  CustomInfo.prototype = new BMap.Overlay();
  CustomInfo.prototype.initialize = () => {
    // this.map = map;

    let div = this.div = document.createElement('div');
    $(div).css(this.divOptions);
    $(div).attr({
      'class': 'baiduWinfo'
    })
    let divContent = document.createElement('div');
    $(divContent).css({
      padding: '10px'
    })
    divContent.innerHTML = this.content;
    this.divContent = divContent;
    div.appendChild(divContent);
    this.map.getPanes().labelPane.appendChild(div);
    return div
  }

  CustomInfo.prototype.draw = () => {
    const map = this.map;
    // console.log($(this.divContent).outerHeight(true));

    const pixel = map.pointToOverlayPixel(this.point);
    this.div.style.left = pixel.x - (this.divOptions.width / 2) + "px";

    this.div.style.top = pixel.y - $(this.divContent).outerHeight(true) - 35 + "px";
    map.addEventListener("zoomend", ({
      type,
      target
    }) => {
      const pixel2 = map.pointToOverlayPixel(this.point);
      this.div.style.left = pixel2.x - (this.divOptions.width / 2) + "px";
      setTimeout(() => {
        let content = $(this.divContent).outerHeight(true);
        this.div.style.top = pixel2.y - $(this.divContent).outerHeight(true) - 35 + "px";

      }, 100);
      // let content = $(this.divContent).outerHeight(true);
      // console.log(2222, $(this.divContent).outerHeight(true));
      // if (content <= 0) {
      //   this.div.style.top = pixel2.y - 35 + "px";
      // } else {

      // }

    })
  }


  export default CustomInfo
