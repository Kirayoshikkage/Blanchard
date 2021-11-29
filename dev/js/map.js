let flag = 0;

window.addEventListener('scroll', function(){
  let scrollY = window.scrollY;

  let mapOffset = document.querySelector("#contacts-map").offsetTop;

  if (scrollY >= mapOffset - 500 && flag == 0) {
    ymaps.ready(init);

    function init() {
      var myMap = new ymaps.Map("contacts-map", {
        center: [55.75869592169767, 37.600960811968434],
        zoom: 17
      }, {
        suppressMapOpenBlock: true
      });
      myMap.controls.remove('largeMapDefaultSet').remove('fullscreenControl').add('geolocationControl')
      myMap.controls.add('zoomControl', {
        size: "small"
      });
      var myPlacemark = new ymaps.Placemark([55.75869592169767, 37.600960811968434], {}, {
        iconLayout: 'default#image',
        iconImageHref: './img/contacts/placemark.svg',
        iconImageSize: [12, 12],
        iconImageOffset: [0, 0]
      });
      myMap.geoObjects.add(myPlacemark);
    }

    flag = 1;
  }
});
