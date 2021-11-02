//validation
new JustValidate('.contacts_form', {
    rules: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 30,
            function: (name, value) => {
                var regex = new RegExp("^[абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\A-Za-z]");
                return regex.test(value)
            }
        },
        tel: {
            required: true,
            function: (name, value) => {
                var regex = new RegExp("^[0-9]+$");
                return regex.test(value)
            }
        },
    },
    messages: {
        name: {
            required: 'Это поле необходимо заполнить!',
            minLength: 'Минимальное кол-во символов в этой форме - 2!',
            maxLength: 'Минимальное кол-во символов в этой форме - 30!',
            function: 'Недопустимый формат'
        },
        tel: {
            required: 'Это поле необходимо заполнить!',
            function: 'Недопустимый формат'
        },
    }
});

//Выпадающее меню (header)
const openmenu = document.querySelectorAll('.drop-menu_link')
const dropMenu = document.querySelectorAll('.sub-menu_list')

openmenu.forEach((item) => {
    item.addEventListener('click', function () {
        submenu = item.nextElementSibling;
        if (submenu.classList.contains('open') == true) {
            submenu.classList.remove('open');
            item.classList.remove('active')
        } else {
            dropMenu.forEach((el) => {
                el.classList.remove('open');
            })
            openmenu.forEach((el) => {
                el.classList.remove('active');
            })
            submenu.classList.add('open');
            item.classList.add('active')
        }
    })
})

// project slider
let projectSlider = document.querySelector('.project_slider'),
    projectSliderList = projectSlider.querySelector('.project_list'),
    projectSliderTrack = projectSlider.querySelector('.project_track'),
    projectSlides = projectSlider.querySelectorAll('.project_slide'),
    projectArrows = projectSlider.querySelector('.project_arrows'),
    projectPrev = projectArrows.children[0],
    projectNext = projectArrows.children[1],
    projecSlideWidth = document.querySelector('.project_track').offsetWidth,
    projecSlideIndexh = 0,
    projecPosInit = 0,
    projectNum = 0,
    projecPosX1 = 0,
    projecPosX2 = 0,
    projecPosY1 = 0,
    projecPosY2 = 0,
    projectPosFinal = 0,
    projectSwipe = false,
    projectisScroll = false,
    projectAllowSwipe = true,
    projectTransition = true,
    projectNextTrf = 0,
    projectPrevTrf = 0,
    projectlastTrf = --projectSlides.length * projecSlideWidth,
    projectPosThreshold = projectSlides[0].offsetWidth * 0.35,
    projectTrfRegExp = /([-0-9.]+(?=px))/,
    projectGetEvent = function () {
        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    };
if (document.body.offsetWidth >= 1520) {
    projectNum = 3
} else if (document.body.offsetWidth < 1520 && document.body.offsetWidth >= 768) {
    projectNum = 2;
} else if (document.body.offsetWidth <= 767) {
    projectNum = 1;
};
projectSlide = function () {
        if (projectTransition) {
            projectSliderTrack.style.transition = 'transform .5s';
        }
        projectSliderTrack.style.transform = `translate3d(-${projecSlideIndexh * projecSlideWidth}px, 0px, 0px)`;

        projectPrev.classList.toggle('disabled', projecSlideIndexh === 0);
        projectNext.classList.toggle('disabled', projecSlideIndexh === Math.floor(--projectSlides.length / projectNum));
    },
    projectSwipeStart = function () {
        let evt = projectGetEvent();

        if (projectAllowSwipe) {

            projectTransition = true;

            projectNextTrf = (projecSlideIndexh + 1) * -projecSlideWidth;
            projectPrevTrf = (projecSlideIndexh - 1) * -projecSlideWidth;

            projecPosInit = projecPosX1 = evt.clientX;
            projecPosY1 = evt.clientY;

            projectSliderTrack.style.transition = '';

            document.addEventListener('touchmove', projectSwipeAction);
            document.addEventListener('mousemove', projectSwipeAction);
            document.addEventListener('touchend', projectSwipeEnd);
            document.addEventListener('mouseup', projectSwipeEnd);

            projectSliderList.classList.remove('grab');
            projectSliderList.classList.add('grabbing');
        }
    },
    projectSwipeAction = function () {

        let evt = projectGetEvent(),
            style = projectSliderTrack.style.transform,
            transform = +style.match(projectTrfRegExp)[0];

        projecPosX2 = projecPosX1 - evt.clientX;
        projecPosX1 = evt.clientX;

        projecPosY2 = projecPosY1 - evt.clientY;
        projecPosY1 = evt.clientY;

        // определение действия свайп или скролл
        if (!projectSwipe && !projectisScroll) {
            let posY = Math.abs(projecPosY2);
            if (posY > 7 || projecPosX2 === 0) {
                projectisScroll = true;
                projectAllowSwipe = false;
            } else if (posY < 7) {
                projectSwipe = true;
            }
        }

        if (projectSwipe) {
            // запрет ухода влево на первом слайде
            if (projecSlideIndexh === 0) {
                if (projecPosInit < projecPosX1) {
                    projectSetTransform(transform, 0);
                    return;
                } else {
                    projectAllowSwipe = true;
                }
            }

            // запрет ухода вправо на последнем слайде
            if (projecSlideIndexh === Math.floor(--projectSlides.length / projectNum)) {
                if (projecPosInit > projecPosX1) {
                    projectSetTransform(transform, projectlastTrf);
                    return;
                } else {
                    projectAllowSwipe = true;
                }
            }

            // запрет протаскивания дальше одного слайда
            if (projecPosInit > projecPosX1 && transform < projectNextTrf || projecPosInit < projecPosX1 && transform > projectPrevTrf) {
                projectReachEdge();
                return;
            }

            // двигаем слайд
            projectSliderTrack.style.transform = `translate3d(${transform - projecPosX2}px, 0px, 0px)`;
        }

    },
    projectSwipeEnd = function () {
        projectPosFinal = projecPosInit - projecPosX1;

        projectisScroll = false;
        projectSwipe = false;

        document.removeEventListener('touchmove', projectSwipeAction);
        document.removeEventListener('mousemove', projectSwipeAction);
        document.removeEventListener('touchend', projectSwipeEnd);
        document.removeEventListener('mouseup', projectSwipeEnd);

        projectSliderList.classList.add('grab');
        projectSliderList.classList.remove('grabbing');

        if (projectAllowSwipe) {
            if (Math.abs(projectPosFinal) > projectPosThreshold) {
                if (projecPosInit < projecPosX1) {
                    projecSlideIndexh--;
                } else if (projecPosInit > projecPosX1) {
                    projecSlideIndexh++;
                }
            }

            if (projecPosInit !== projecPosX1) {
                projectAllowSwipe = false;
                projectSlide();
            } else {
                projectAllowSwipe = true;
            }

        } else {
            projectAllowSwipe = true;
        }

    },
    projectSetTransform = function (transform, comapreTransform) {
        if (transform >= comapreTransform) {
            if (transform > comapreTransform) {
                projectSliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
            }
        }
        projectAllowSwipe = false;
    },
    projectReachEdge = function () {
        projectTransition = false;
        projectSwipeEnd();
        projectAllowSwipe = true;
    };

projectSliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
projectSliderList.classList.add('grab');

projectSliderTrack.addEventListener('transitionend', () => projectAllowSwipe = true);
projectSlider.addEventListener('touchstart', projectSwipeStart);
projectSlider.addEventListener('mousedown', projectSwipeStart);

projectArrows.addEventListener('click', function () {
    let target = event.target;

    if (target.classList.contains('next')) {
        projecSlideIndexh++;
    } else if (target.classList.contains('prev')) {
        projecSlideIndexh--;
    } else {
        return;
    }

    projectSlide();
});
//slider-editions
let editionsSlider = document.querySelector('.editions_slider'),
    editionsSliderList = editionsSlider.querySelector('.editions_list'),
    editionsSliderTrack = editionsSlider.querySelector('.editions_track'),
    editionsSlides = editionsSlider.querySelectorAll('.editions_slide'),
    editionsArrows = editionsSlider.querySelector('.editions_arrows'),
    editionsCounterFirst = document.querySelector('.editions_first');
editionsCounterLast = document.querySelector('.editions_last');
editionsCounter = 1
editionsPrev = editionsArrows.children[0],
    editionsNext = editionsArrows.children[1],
    editionsSlideWidth = document.querySelector('.editions_slider').offsetWidth
editionsSlideIndex = 0,
    editionsPosInit = 0,
    editionsPosX1 = 0,
    editionsPosX2 = 0,
    editionsPosY1 = 0,
    editionsPosY2 = 0,
    editionsNum = 0,
    editionsCount = 0,
    editionsPosFinal = 0,
    editionsIsSwipe = false,
    editionsIsScroll = false,
    editionsAllowSwipe = true,
    editionsTransition = true,
    editionsNextTrf = 0,
    editionsPrevTrf = 0,
    editionsLastTrf = --editionsSlides.length * editionsSlideWidth,
    editionsPosThreshold = editionsSlides[0].offsetWidth * 0.2,
    editionsTrfRegExp = /([-0-9.]+(?=px))/,
    editionsGetEvent = function () {
        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    };
if (document.body.offsetWidth >= 1520) {
    editionsNum = 3
    editionsCount = 3
} else if (document.body.offsetWidth <= 1520) {
    editionsNum = 2
    editionsCount = 2
}
if (document.body.offsetWidth < 768) {
    editionsAllowSwipe = false
    editionsTransition = false
} else {
    editionsAllowSwipe = true
    editionsTransition = true
}
editionsCounterLast.innerHTML = Math.ceil(editionsSlides.length / editionsCount)
editionsSlide = function () {
        if (editionsTransition) {
            editionsSliderTrack.style.transition = 'transform .5s';
        }
        editionsSliderTrack.style.transform = `translate3d(-${editionsSlideIndex * editionsSlideWidth}px, 0px, 0px)`;

        editionsPrev.classList.toggle('disabled', editionsSlideIndex === 0);
        editionsNext.classList.toggle('disabled', editionsSlideIndex === Math.floor(--editionsSlides.length / editionsNum));
    },
    editionsSwipeStart = function () {
        let evt = editionsGetEvent();


        if (editionsAllowSwipe) {

            editionsTransition = true;

            editionsNextTrf = (editionsSlideIndex + 1) * -editionsSlideWidth;
            editionsPrevTrf = (editionsSlideIndex - 1) * -editionsSlideWidth;

            editionsPosInit = editionsPosX1 = evt.clientX;
            editionsPosY1 = evt.clientY;

            editionsSliderTrack.style.transition = '';

            document.addEventListener('touchmove', editionsSwipeAction);
            document.addEventListener('mousemove', editionsSwipeAction);
            document.addEventListener('touchend', editionsSwipeEnd);
            document.addEventListener('mouseup', editionsSwipeEnd);



            editionsSliderList.classList.remove('grab');
            editionsSliderList.classList.add('grabbing');
        }
    },
    editionsSwipeAction = function () {


        let evt = editionsGetEvent(),
            style = editionsSliderTrack.style.transform,
            transform = +style.match(editionsTrfRegExp)[0];

        editionsPosX2 = editionsPosX1 - evt.clientX;
        editionsPosX1 = evt.clientX;

        editionsPosY2 = editionsPosY1 - evt.clientY;
        editionsPosY1 = evt.clientY;

        // определение действия свайп или скролл
        if (!editionsIsSwipe && !editionsIsScroll) {
            let posY = Math.abs(editionsPosY2);
            if (posY > 7 || editionsPosX2 === 0) {
                editionsIsScroll = true;
                editionsAllowSwipe = false;
            } else if (posY < 7) {
                editionsIsSwipe = true;
            }
        }

        if (editionsIsSwipe) {
            // запрет ухода влево на первом слайде
            if (editionsSlideIndex === 0) {
                if (editionsPosInit < editionsPosX1) {
                    editionsSetTransform(transform, 0);
                    return;
                } else {
                    editionsAllowSwipe = true;
                }
            }

            // запрет ухода вправо на последнем слайде
            if (editionsSlideIndex === Math.floor(--editionsSlides.length / editionsNum)) {
                if (editionsPosInit > editionsPosX1) {
                    editionsSetTransform(transform, editionsLastTrf);
                    return;
                } else {
                    editionsAllowSwipe = true;
                }
            }

            // запрет протаскивания дальше одного слайда
            if (editionsPosInit > editionsPosX1 && transform < editionsNextTrf || editionsPosInit < editionsPosX1 && transform > editionsPrevTrf) {
                editionsReachEdge();
                return;
            }

            // двигаем слайд
            editionsSliderTrack.style.transform = `translate3d(${transform - editionsPosX2}px, 0px, 0px)`;
        }

    },
    editionsSwipeEnd = function () {
        editionsPosFinal = editionsPosInit - editionsPosX1;


        editionsIsScroll = false;
        editionsIsSwipe = false;

        document.removeEventListener('touchmove', editionsSwipeAction);
        document.removeEventListener('mousemove', editionsSwipeAction);
        document.removeEventListener('touchend', editionsSwipeEnd);
        document.removeEventListener('mouseup', editionsSwipeEnd);

        editionsSliderList.classList.add('grab');
        editionsSliderList.classList.remove('grabbing');

        if (editionsAllowSwipe) {
            if (Math.abs(editionsPosFinal) > editionsPosThreshold) {
                if (editionsPosInit < editionsPosX1) {
                    editionsSlideIndex--;
                    editionsCounter--
                    editionsCounterFirst.innerHTML = editionsCounter
                } else if (editionsPosInit > editionsPosX1) {
                    editionsSlideIndex++;
                    editionsCounter++
                    editionsCounterFirst.innerHTML = editionsCounter
                }
            }

            if (editionsPosInit !== editionsPosX1) {
                editionsAllowSwipe = false;
                editionsSlide();
            } else {
                editionsAllowSwipe = true;
            }

        } else {
            editionsAllowSwipe = true;
        }

    },
    editionsSetTransform = function (transform, comapreTransform) {
        if (transform >= comapreTransform) {
            if (transform > comapreTransform) {
                editionsSliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
            }
        }
        editionsAllowSwipe = false;
    },
    editionsReachEdge = function () {
        editionsTransition = false;
        editionsSwipeEnd();
        editionsAllowSwipe = true;
    };

editionsSliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
editionsSliderList.classList.add('grab');

editionsSliderTrack.addEventListener('transitionend', () => editionsAllowSwipe = true);
editionsSlider.addEventListener('touchstart', editionsSwipeStart);
editionsSlider.addEventListener('mousedown', editionsSwipeStart);

editionsArrows.addEventListener('click', function () {
    let target = event.target;


    if (target.classList.contains('next')) {
        editionsSlideIndex++;
        editionsCounter++
        editionsCounterFirst.innerHTML = editionsCounter
    } else if (target.classList.contains('prev')) {
        editionsSlideIndex--;
        editionsCounter--
        editionsCounterFirst.innerHTML = editionsCounter
    } else {
        return;
    }

    editionsSlide();
});

//

let select = function () {
    let selectHeader = document.querySelectorAll('.select__header'),
        selectItem = document.querySelectorAll('.select__item'),
        selecteditem = document.querySelector('.select__current').textContent

    selectHeader.forEach(item => {
        item.addEventListener('click', selectToggle)
    });

    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }

    selectItem.forEach(item => {
        item.addEventListener('click', selectChoose)
        item.addEventListener('click', hideselected)
    });


    function hideselected() {
        let selitem = document.querySelector('.hidden');
        selitem.classList.remove('hidden')
        this.classList.add('hidden');
    }

    function selectChoose() {
        let text = this.innerText,
            select = this.closest('.select'),
            currentText = select.querySelector('.select__current')
        currentText.innerText = text;
        select.classList.remove('is-active')

    }

};

select();

//editions-select
const editionsHeader = document.querySelector('.editions_header')
const editionsBody = document.querySelector('.editions_body')
const editionsItem = document.querySelectorAll('.editions_label')
const editionsIcon = document.querySelector('.editions_icon')

if (document.body.offsetWidth < 768) {
    editionsHeader.addEventListener('click', function () {
        editionsBody.classList.toggle('is-active')
        editionsIcon.classList.toggle('active')
    })
    editionsItem.forEach((item) => {
        item.addEventListener('change', function () {
            item.classList.toggle('selected')
            item.classList.toggle('editions_label-active')
        })
    })
}

//editions-input

if (document.body.offsetWidth >= 768) {
    const editionslabel = document.querySelectorAll('.editions_input')
    editionslabel.forEach((item) => {
        item.addEventListener('click', function () {
            let parent = item.closest('.editions_label')
            parent.classList.toggle('editions_label-active')
        })
    })
}

//editions-grid 
editionsItem.forEach((item, index) => {
    item.classList.add(`editions_label-${index}`)
})
//akkordion

document.querySelectorAll('.accordion_trigger').forEach((item) => {
    item.addEventListener('click', () => {
        const parent = item.parentNode;
        if (parent.classList.contains('accordion_item-active')) {
            parent.classList.remove('accordion_item-active')
        } else {
            document
                .querySelectorAll('.accordion_item')
                .forEach((child) => child.classList.remove('accordion_item-active'))
            parent.classList.add('accordion_item-active')
        }
    })
})

// tabs 
document.querySelectorAll('.сatalog_trigger').forEach((item) => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        let id = e.target.getAttribute('href').replace('#', '')

        document.querySelectorAll('.сatalog_trigger').forEach((child) => {
            child.classList.remove('сatalog_trigger-active')
        })

        document.querySelectorAll('.сatalog_item').forEach((child) => {
            child.classList.remove('сatalog_item-active')
        })

        item.classList.add('сatalog_trigger-active')

        document.getElementById(id).classList.add('сatalog_item-active')
    })
})

document.querySelectorAll('.tabs_trigger-italy').forEach((item) => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        const id = e.target.getAttribute('href').replace('#', '')


        document.querySelectorAll('.tabs_item-italy').forEach((child) => {
            child.classList.remove('tabs_active-italy')
        })

        document.getElementById(id).classList.add('tabs_active-italy')
    })
})

// плавный скролл
const anchors = document.querySelectorAll('.smooth')

for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const blockID = anchor.getAttribute('href')
        document.querySelector('' + blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    })
}

const body = document.body

//search

const searchBtnOpen = document.querySelector('.navigation_btn')
let searchBtnClose = document.querySelector('.search_close'),
searchTl = gsap.timeline({})

searchTl.to('.navigation_btn',{
    x: 0,
    opacity: 0,
    ease: Power2.easeOut,
    duration: .4
})
.fromTo('.navigation_search',{
    display: 'none',
    x: 30,
    opacity: 0,
    ease: Power2.easeOut,
    duration: .4
}, {
    display: "flex",
    x: 0,
    opacity: 1,
    ease: Power2.easeOut,
    duration: .4
}, "-=0.2").reversed(true)

searchBtnOpen.addEventListener('click', function(){
    searchTl.play()
})

searchBtnClose.addEventListener('click', function(){
    searchTl.reverse()
})

//Бургер

const burgerBtnOpen = document.querySelector('.burger_icon')
const burgerBtnClose = document.querySelector('.burger_close')
const burgerMenuItem = document.querySelectorAll('.menu_item')

const tlburger = gsap.timeline({})
tlburger.fromTo('.burger', {
        display: 'none',
        y: 100,
        opacity: 0,
        ease: Power2.easeOut,
        duration: .3
    }, {
        display: "block",
        y: 0,
        opacity: 1,
        ease: Power2.easeOut,
        duration: .3
    })
    .fromTo('.burger_close', {
        display:'none',
        y:-100,
        opacity:0,
        ease: Power2.easeOut,
        duration: .3
    }, {
        display: "block",
        y: 0,
        opacity: 1,
        ease: Power2.easeOut,
        duration: .3
    }, '-=0.1')
    .fromTo('.burger_menu', {
        y:30,
        opacity:0,
        ease: Power2.easeOut,
        duration: .3
    }, {
        y: 0,
        opacity: 1,
        ease: Power2.easeOut,
        duration: .3
    })
    .fromTo('.burger_login', {
        y:30,
        opacity:0,
        ease: Power2.easeOut,
        duration: .3
    }, {
        y: 0,
        opacity: 1,
        ease: Power2.easeOut,
        duration: .3
    })
tlburger.reversed(true)

burgerBtnOpen.addEventListener('click', function(){
    tlburger.play()
    body.classList.toggle('scroll-hidden')
})
burgerBtnClose.addEventListener('click', function(){
    tlburger.reverse()
    body.classList.toggle('scroll-hidden')
})
burgerMenuItem.forEach((item)=> {
    item.addEventListener('click', function(){
        tlburger.reverse()
        body.classList.remove('scroll-hidden')
    })
})


//heroSlider
let heroSlider = document.querySelector('.hero_slider'),
    heroSliderList = heroSlider.querySelector('.hero_list'),
    heroSliderTrack = heroSlider.querySelector('.hero_track'),
    heroSlides = heroSlider.querySelectorAll('.hero_slide'),
    heroSlideWidth = heroSlides[0].offsetWidth,
    heroSlideIndex = 0,
    heroPosInit = 0,
    heroPosX1 = 0,
    heroPosX2 = 0,
    heroPosY1 = 0,
    heroPosY2 = 0,
    heroPosFinal = 0,
    heroIsSwipe = false,
    heroIsScroll = false,
    heroAllowSwipe = true,
    heroTransition = true,
    heroNextTrf = 0,
    heroPrevTrf = 0,
    heroLastTrf = --heroSlides.length * heroSlideWidth,
    heroPosThreshold = heroSlides[0].offsetWidth * 0.1,
    heroTrfRegExp = /([-0-9.]+(?=px))/,
    heroGetEvent = function () {
        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    },
    heroSlide = function () {
        if (heroTransition) {
            heroSliderTrack.style.transition = 'transform .5s';
        }
        heroSliderTrack.style.transform = `translate3d(-${heroSlideIndex * heroSlideWidth}px, 0px, 0px)`;
    },
    heroSwipeStart = function () {
        let evt = heroGetEvent();

        if (heroAllowSwipe) {

            heroTransition = true;

            heroNextTrf = (heroSlideIndex + 1) * -heroSlideWidth;
            heroPrevTrf = (heroSlideIndex - 1) * -heroSlideWidth;

            heroPosInit = heroPosX1 = evt.clientX;
            heroPosY1 = evt.clientY;

            heroSliderTrack.style.transition = '';

            document.addEventListener('touchmove', heroSwipeAction);
            document.addEventListener('mousemove', heroSwipeAction);
            document.addEventListener('touchend', heroSwipeEnd);
            document.addEventListener('mouseup', heroSwipeEnd);

            heroSliderList.classList.remove('grab');
            heroSliderList.classList.add('grabbing');
        }
    },
    heroSwipeAction = function () {

        let evt = heroGetEvent(),
            style = heroSliderTrack.style.transform,
            transform = +style.match(heroTrfRegExp)[0];

        heroPosX2 = heroPosX1 - evt.clientX;
        heroPosX1 = evt.clientX;

        heroPosY2 = heroPosY1 - evt.clientY;
        heroPosY1 = evt.clientY;

        // определение действия свайп или скролл
        if (!heroIsSwipe && !heroIsScroll) {
            let posY = Math.abs(heroPosY2);
            if (posY > 7 || heroPosX2 === 0) {
                heroIsScroll = true;
                heroAllowSwipe = false;
            } else if (posY < 7) {
                heroIsSwipe = true;
            }
        }

        if (heroIsSwipe) {
            // запрет ухода влево на первом слайде
            if (heroSlideIndex === 0) {
                if (heroPosInit < heroPosX1) {
                    heroSetTransform(transform, 0);
                    return;
                } else {
                    heroAllowSwipe = true;
                }
            }

            // запрет ухода вправо на последнем слайде
            if (heroSlideIndex === --heroSlides.length) {
                if (heroPosInit > heroPosX1) {
                    heroSetTransform(transform, heroLastTrf);
                    return;
                } else {
                    heroAllowSwipe = true;
                }
            }

            // запрет протаскивания дальше одного слайда
            if (heroPosInit > heroPosX1 && transform < heroNextTrf || heroPosInit < heroPosX1 && transform > heroPrevTrf) {
                heroReachEdge();
                return;
            }

            // двигаем слайд
            heroSliderTrack.style.transform = `translate3d(${transform - heroPosX2}px, 0px, 0px)`;
        }

    },
    heroSwipeEnd = function () {
        heroPosFinal = heroPosInit - heroPosX1;

        heroIsScroll = false;
        heroIsSwipe = false;

        document.removeEventListener('touchmove', heroSwipeAction);
        document.removeEventListener('mousemove', heroSwipeAction);
        document.removeEventListener('touchend', heroSwipeEnd);
        document.removeEventListener('mouseup', heroSwipeEnd);

        heroSliderList.classList.add('grab');
        heroSliderList.classList.remove('grabbing');

        if (heroAllowSwipe) {
            if (Math.abs(heroPosFinal) > heroPosThreshold) {
                if (heroPosInit < heroPosX1) {
                    heroSlideIndex--;
                } else if (heroPosInit > heroPosX1) {
                    heroSlideIndex++;
                }
            }

            if (heroPosInit !== heroPosX1) {
                heroAllowSwipe = false;
                heroSlide();
            } else {
                heroAllowSwipe = true;
            }

        } else {
            heroAllowSwipe = true;
        }

    },
    heroSetTransform = function (transform, comapreTransform) {
        if (transform >= comapreTransform) {
            if (transform > comapreTransform) {
                heroSliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
            }
        }
        heroAllowSwipe = false;
    },
    heroReachEdge = function () {
        heroTransition = false;
        heroSwipeEnd();
        heroAllowSwipe = true;
    };

heroSliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
heroSliderList.classList.add('grab');

heroSliderTrack.addEventListener('transitionend', () => heroAllowSwipe = true);
heroSlider.addEventListener('touchstart', heroSwipeStart);
heroSlider.addEventListener('mousedown', heroSwipeStart);

//gallery slider
let gallerySlider = document.querySelector('.gallery_slider'),
    gallerySliderList = gallerySlider.querySelector('.gallery_list'),
    gallerySliderTrack = gallerySlider.querySelector('.gallery_track'),
    gallerySlides = gallerySlider.querySelectorAll('.gallery_slide'),
    galleryArrows = gallerySlider.querySelector('.gallery_arrows'),
    galleryCounterFirst = document.querySelector('.slider_first');
galleryCounterLast = document.querySelector('.slider_last');
galleryCounter = 1
galleryPrev = galleryArrows.children[0],
    galleryNext = galleryArrows.children[1],
    gallerySlideWidth = document.querySelector('.gallery_slider').offsetWidth
gallerySlideIndex = 0,
    galleryPosInit = 0,
    galleryPosX1 = 0,
    galleryPosX2 = 0,
    galleryPosY1 = 0,
    galleryPosY2 = 0,
    galleryNum = 0,
    galleryCount = 0,
    galleryPosFinal = 0,
    galleryIsSwipe = false,
    galleryIsScroll = false,
    galleryAllowSwipe = true,
    galleryTransition = true,
    galleryNextTrf = 0,
    galleryPrevTrf = 0,
    galleryLastTrf = --gallerySlides.length * gallerySlideWidth,
    galleryPosThreshold = gallerySlides[0].offsetWidth * 0.2,
    galleryTrfRegExp = /([-0-9.]+(?=px))/,
    galleryGetEvent = function () {
        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    };
if (body.offsetWidth > 1700) {
    galleryCount = 6
    galleryNum = 6
} else
if (body.offsetWidth >= 768 && body.offsetWidth <= 1700) {
    galleryCount = 4
    galleryNum = 4
} else
if (body.offsetWidth <= 768) {
    galleryCount = 1
    galleryNum = 1
}
galleryCounterLast.innerHTML = Math.ceil(gallerySlides.length / galleryCount)
gallerySlide = function () {
        if (galleryTransition) {
            gallerySliderTrack.style.transition = 'transform .5s';
        }
        gallerySliderTrack.style.transform = `translate3d(-${gallerySlideIndex * gallerySlideWidth}px, 0px, 0px)`;

        galleryPrev.classList.toggle('disabled', gallerySlideIndex === 0);
        galleryNext.classList.toggle('disabled', gallerySlideIndex === Math.floor(--gallerySlides.length / galleryNum));
    },
    gallerySwipeStart = function () {
        let evt = galleryGetEvent();


        if (galleryAllowSwipe) {

            galleryTransition = true;

            galleryNextTrf = (gallerySlideIndex + 1) * -gallerySlideWidth;
            galleryPrevTrf = (gallerySlideIndex - 1) * -gallerySlideWidth;

            galleryPosInit = galleryPosX1 = evt.clientX;
            galleryPosY1 = evt.clientY;

            gallerySliderTrack.style.transition = '';

            document.addEventListener('touchmove', gallerySwipeAction);
            document.addEventListener('mousemove', gallerySwipeAction);
            document.addEventListener('touchend', gallerySwipeEnd);
            document.addEventListener('mouseup', gallerySwipeEnd);



            gallerySliderList.classList.remove('grab');
            gallerySliderList.classList.add('grabbing');
        }
    },
    gallerySwipeAction = function () {


        let evt = galleryGetEvent(),
            style = gallerySliderTrack.style.transform,
            transform = +style.match(galleryTrfRegExp)[0];

        galleryPosX2 = galleryPosX1 - evt.clientX;
        galleryPosX1 = evt.clientX;

        galleryPosY2 = galleryPosY1 - evt.clientY;
        galleryPosY1 = evt.clientY;

        // определение действия свайп или скролл
        if (!galleryIsSwipe && !galleryIsScroll) {
            let posY = Math.abs(galleryPosY2);
            if (posY > 7 || galleryPosX2 === 0) {
                galleryIsScroll = true;
                galleryAllowSwipe = false;
            } else if (posY < 7) {
                galleryIsSwipe = true;
            }
        }

        if (galleryIsSwipe) {
            // запрет ухода влево на первом слайде
            if (gallerySlideIndex === 0) {
                if (galleryPosInit < galleryPosX1) {
                    gallerySetTransform(transform, 0);
                    return;
                } else {
                    galleryAllowSwipe = true;
                }
            }

            // запрет ухода вправо на последнем слайде
            if (gallerySlideIndex === Math.floor(--gallerySlides.length / galleryNum)) {
                if (galleryPosInit > galleryPosX1) {
                    gallerySetTransform(transform, galleryLastTrf);
                    return;
                } else {
                    galleryAllowSwipe = true;
                }
            }

            // запрет протаскивания дальше одного слайда
            if (galleryPosInit > galleryPosX1 && transform < galleryNextTrf || galleryPosInit < galleryPosX1 && transform > galleryPrevTrf) {
                galleryReachEdge();
                return;
            }

            // двигаем слайд
            gallerySliderTrack.style.transform = `translate3d(${transform - galleryPosX2}px, 0px, 0px)`;
        }

    },
    gallerySwipeEnd = function () {
        galleryPosFinal = galleryPosInit - galleryPosX1;


        galleryIsScroll = false;
        galleryIsSwipe = false;

        document.removeEventListener('touchmove', gallerySwipeAction);
        document.removeEventListener('mousemove', gallerySwipeAction);
        document.removeEventListener('touchend', gallerySwipeEnd);
        document.removeEventListener('mouseup', gallerySwipeEnd);

        gallerySliderList.classList.add('grab');
        gallerySliderList.classList.remove('grabbing');

        if (galleryAllowSwipe) {
            if (Math.abs(galleryPosFinal) > galleryPosThreshold) {
                if (galleryPosInit < galleryPosX1) {
                    gallerySlideIndex--;
                    galleryCounter--
                    galleryCounterFirst.innerHTML = galleryCounter
                } else if (galleryPosInit > galleryPosX1) {
                    gallerySlideIndex++;
                    galleryCounter++
                    galleryCounterFirst.innerHTML = galleryCounter
                }
            }

            if (galleryPosInit !== galleryPosX1) {
                galleryAllowSwipe = false;
                gallerySlide();
            } else {
                galleryAllowSwipe = true;
            }

        } else {
            galleryAllowSwipe = true;
        }

    },
    gallerySetTransform = function (transform, comapreTransform) {
        if (transform >= comapreTransform) {
            if (transform > comapreTransform) {
                gallerySliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
            }
        }
        galleryAllowSwipe = false;
    },
    galleryReachEdge = function () {
        galleryTransition = false;
        gallerySwipeEnd();
        galleryAllowSwipe = true;
    };

gallerySliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
gallerySliderList.classList.add('grab');

gallerySliderTrack.addEventListener('transitionend', () => galleryAllowSwipe = true);
gallerySlider.addEventListener('touchstart', gallerySwipeStart);
gallerySlider.addEventListener('mousedown', gallerySwipeStart);

galleryArrows.addEventListener('click', function () {
    let target = event.target;


    if (target.classList.contains('next')) {
        gallerySlideIndex++;
        galleryCounter++
        galleryCounterFirst.innerHTML = galleryCounter
    } else if (target.classList.contains('prev')) {
        gallerySlideIndex--;
        galleryCounter--
        galleryCounterFirst.innerHTML = galleryCounter
    } else {
        return;
    }

    gallerySlide();
});

//development
let developmentsBtn = document.querySelector('.developments_btn'),
developmentsItem = document.querySelectorAll('.developments_item'),
developmentsPoint = document.querySelectorAll('.developments_point'),
developmentsPoints = document.querySelector('.developments_points')

if (developmentsItem.length !== developmentsPoint.length){
    let developmentsRaznost = Math.abs(developmentsPoint.length - developmentsItem.length )
    for (let i = 0; i < developmentsRaznost; i++){
        let button = document.createElement('button');
        button.classList.add('developments_point');
        button.innerHTML = developmentsPoint[1].innerHTML
        developmentsPoints.append(button)
        developmentsPoint = document.querySelectorAll('.developments_point')
    }
}


if (body.offsetWidth < 1024) {
    developmentsItem.forEach((el, index) => {
        if (index > 1) {
            el.classList.add('developments_item-hidden')
        }
    })
} else {
    developmentsItem.forEach((el, index) => {
        if (index <= 2) {
            el.classList.remove('developments_item-hidden')
        }
    })
}

developmentsBtn.addEventListener('click', function () {
    developmentsItem.forEach((e, index) => {
        if (body.offsetWidth >= 1024) {
            if (index > 2) {
                e.classList.toggle('developments_item-hidden')
            }
        } else {
            if (index > 1) {
                e.classList.toggle('developments_item-hidden')
            }
        }
    })
})
//developments slider
let developmentsSlider = document.querySelector('.developments_slider'),
    developmentsSliderList = developmentsSlider.querySelector('.developments_list'),
    developmentsSliderTrack = developmentsSlider.querySelector('.developments_track'),
    developmentsSlides = developmentsSlider.querySelectorAll('.developments_slide'),
    developmentsSlideWidth = developmentsSlides[0].offsetWidth,
    developmentsIndex = 0,
    developmentsPosInit = 0,
    developmentsPosX1 = 0,
    developmentsCount = 0,
    developmentsPosX2 = 0,
    developmentsPosY1 = 0,
    developmentsPosY2 = 0,
    developmentsPosFinal = 0,
    developmentsIsSwipe = false,
    developmentsIsScroll = false,
    developmentsAllowSwipe = true,
    developmentsTransition = true,
    developmentsNextTrf = 0,
    developmentsPrevTrf = 0,
    developmentsLastTrf = --developmentsSlides.length * developmentsSlideWidth,
    developmentsPosThreshold = developmentsSlides[0].offsetWidth * 0.1,
    developmenTstrfRegExp = /([-0-9.]+(?=px))/,
    developmentsGetEvent = function () {
        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    };
if (document.body.offsetWidth > 768) {
    developmentsAllowSwipe = false
    developmentsTransition = false
} else {
    developmentsAllowSwipe = true
    developmentsTransition = true
}
developmentsSlide = function () {
        if (developmentsTransition) {
            developmentsSliderTrack.style.transition = 'transform .5s';
        }
        developmentsSliderTrack.style.transform = `translate3d(-${developmentsIndex * developmentsSlideWidth}px, 0px, 0px)`;
    },
    developmentsSwipeStart = function () {
        let evt = developmentsGetEvent();

        if (developmentsAllowSwipe) {

            developmentsTransition = true;

            developmentsNextTrf = (developmentsIndex + 1) * -developmentsSlideWidth;
            developmentsPrevTrf = (developmentsIndex - 1) * -developmentsSlideWidth;

            developmentsPosInit = developmentsPosX1 = evt.clientX;
            developmentsPosY1 = evt.clientY;

            developmentsSliderTrack.style.transition = '';

            document.addEventListener('touchmove', developmentsSwipeAction);
            document.addEventListener('mousemove', developmentsSwipeAction);
            document.addEventListener('touchend', developmentsSwipeEnd);
            document.addEventListener('mouseup', developmentsSwipeEnd);

            developmentsSliderList.classList.remove('grab');
            developmentsSliderList.classList.add('grabbing');
        }
    },
    developmentsSwipeAction = function () {

        let evt = developmentsGetEvent(),
            style = developmentsSliderTrack.style.transform,
            transform = +style.match(developmenTstrfRegExp)[0];

        developmentsPosX2 = developmentsPosX1 - evt.clientX;
        developmentsPosX1 = evt.clientX;

        developmentsPosY2 = developmentsPosY1 - evt.clientY;
        developmentsPosY1 = evt.clientY;

        // определение действия свайп или скролл
        if (!developmentsIsSwipe && !developmentsIsScroll) {
            let posY = Math.abs(developmentsPosY2);
            if (posY > 7 || developmentsPosX2 === 0) {
                developmentsIsScroll = true;
                developmentsAllowSwipe = false;
            } else if (posY < 7) {
                developmentsIsSwipe = true;
            }
        }

        if (developmentsIsSwipe) {
            // запрет ухода влево на первом слайде
            if (developmentsIndex === 0) {
                if (developmentsPosInit < developmentsPosX1) {
                    developmentsSetTransform(transform, 0);
                    return;
                } else {
                    developmentsAllowSwipe = true;
                }
            }

            // запрет ухода вправо на последнем слайде
            if (developmentsIndex === --developmentsSlides.length) {
                if (developmentsPosInit > developmentsPosX1) {
                    developmentsSetTransform(transform, developmentsLastTrf);
                    return;
                } else {
                    developmentsAllowSwipe = true;
                }
            }

            // запрет протаскивания дальше одного слайда
            if (developmentsPosInit > developmentsPosX1 && transform < developmentsNextTrf || developmentsPosInit < developmentsPosX1 && transform > developmentsPrevTrf) {
                developmentsReachEdge();
                return;
            }

            // двигаем слайд
            developmentsSliderTrack.style.transform = `translate3d(${transform - developmentsPosX2}px, 0px, 0px)`;
        }

    },
    developmentsSwipeEnd = function () {
        developmentsPosFinal = developmentsPosInit - developmentsPosX1;

        developmentsIsScroll = false;
        developmentsIsSwipe = false;

        document.removeEventListener('touchmove', developmentsSwipeAction);
        document.removeEventListener('mousemove', developmentsSwipeAction);
        document.removeEventListener('touchend', developmentsSwipeEnd);
        document.removeEventListener('mouseup', developmentsSwipeEnd);

        developmentsSliderList.classList.add('grab');
        developmentsSliderList.classList.remove('grabbing');

        if (developmentsAllowSwipe) {
            if (Math.abs(developmentsPosFinal) > developmentsPosThreshold) {
                if (developmentsPosInit < developmentsPosX1) {
                    developmentsIndex--;
                    developmentsCount--
                } else if (developmentsPosInit > developmentsPosX1) {
                    developmentsIndex++;
                    developmentsCount++
                }
            }

            if (developmentsPosInit !== developmentsPosX1) {
                developmentsAllowSwipe = false;
                developmentsSlide();
            } else {
                developmentsAllowSwipe = true;
            }

        } else {
            developmentsAllowSwipe = true;
        }
        developmentsPoint.forEach((item, index) => {
            if (index === developmentsCount) {
                developmentsPoint.forEach((element) => {
                    element.classList.remove('developments_point-active')
                })
                item.classList.add('developments_point-active')
            }
        })

    },
    developmentsSetTransform = function (transform, comapreTransform) {
        if (transform >= comapreTransform) {
            if (transform > comapreTransform) {
                developmentsSliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
            }
        }
        developmentsAllowSwipe = false;
    },
    developmentsReachEdge = function () {
        developmentsTransition = false;
        developmentsSwipeEnd();
        developmentsAllowSwipe = true;
    };

developmentsSliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
developmentsSliderList.classList.add('grab');

developmentsSliderTrack.addEventListener('transitionend', () => developmentsAllowSwipe = true);
developmentsSlider.addEventListener('touchstart', developmentsSwipeStart);
developmentsSlider.addEventListener('mousedown', developmentsSwipeStart);

developmentsPoint.forEach((item, index) => {
    item.addEventListener('click', function () {
        developmentsPoint.forEach((element) => {
            element.classList.remove('developments_point-active')
        })
        item.classList.add('developments_point-active')
        let transform = developmentsSlides[index].offsetWidth * index
        developmentsIndex = index
        developmentsCount = index

        developmentsSliderTrack.style.transition = 'transform .5s';
        developmentsSliderTrack.style.transform = `translate3d(${-transform}px, 0px, 0px)`;
    })
    if (index === developmentsCount) {
        item.classList.add('developments_point-active')
    }
})

let tooltipElem = null,

    tooltipClick = false,

    tooltipCounter = 0,

    tooltipTrigger = document.querySelectorAll('.tooltip_trigger'),

    tooltipOpen = function (event) {
        if (tooltipElem == null) {

            let target = event.target;

            let tooltipHtml = this.dataset.tooltip;
            if (!tooltipHtml) return;

            tooltipElem = document.createElement('div');
            tooltipElem.className = 'tooltip';
            tooltipElem.innerHTML = tooltipHtml;
            document.body.append(tooltipElem);

            let coords = target.getBoundingClientRect();

            let top = coords.top - tooltipElem.offsetHeight - 5;
            if (top < 0) {
                top = coords.top + target.offsetHeight + 5;
            }

            let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
            if (left < 0) {
                left = 0;
                top = coords.top + target.offsetHeight + 5;
            }

            let right = Math.abs(coords.left - document.body.offsetWidth + target.offsetWid) - (tooltipElem.offsetWidth) / 2;
            if (right < 0) {
                right = 0;
                top = coords.top + target.offsetHeight + 5;
            }

            if (left > right) {
                tooltipElem.style.right = right + 'px';
            } else {
                tooltipElem.style.left = left + 'px';
            }


            tooltipElem.style.top = top + 'px';
        }
    },
    tooltipClickOpen = function (event) {
        tooltipCounter++
        if (tooltipElem !== null) {
            tooltipClick = true
        }
        if (tooltipCounter % 2 == 0) {
            tooltipElem.remove();
            tooltipElem = null;
            tooltipClick = false
        }

    },
    tooltipClose = function (event) {
        if (tooltipClick) {
            return
        }
        if (tooltipElem) {
            tooltipElem.remove();
            tooltipElem = null;
        }
    }

tooltipTrigger.forEach((item) => {
    item.addEventListener('mouseover', tooltipOpen);
    item.addEventListener('mouseout', tooltipClose);

    if (document.body.clientWidth >= 1024) {

        item.addEventListener('focus', tooltipOpen);
        item.addEventListener('blur', tooltipClose);

        item.addEventListener('click', tooltipClickOpen);
    }
})

window.addEventListener('scroll', function () {

    if (tooltipElem) {
        tooltipElem.remove();
        tooltipElem = null;
    }

});

//resize
window.addEventListener("resize", () => {
    projecSlideWidth = document.querySelector('.project_track').offsetWidth

    gallerySlideWidth = document.querySelector('.gallery_slider').offsetWidth

    developmentsSlideWidth = developmentsSlides[0].offsetWidth,

    heroSlideWidth = heroSlides[0].offsetWidth

    editionsSlideWidth = document.querySelector('.editions_slider').offsetWidth

    galleryCounterLast.innerHTML = Math.ceil(gallerySlides.length / galleryCount)

    editionsCounterLast.innerHTML = Math.ceil(editionsSlides.length / editionsCount)

    if (body.offsetWidth > 1700) {
        galleryCount = 6
        galleryNum = 6
    } else
    if (body.offsetWidth >= 768 && body.offsetWidth <= 1700) {
        galleryCount = 4
        galleryNum = 4
    } else
    if (body.offsetWidth <= 768) {
        galleryCount = 1
        galleryNum = 1
    }

    if (document.body.offsetWidth < 768) {
        editionsAllowSwipe = false
        editionsTransition = false
        editionsSlideIndex = 0
        editionsCounter = 1
        editionsCounterFirst.innerHTML = editionsCounter
        editionsSliderTrack.style.transition = 'none';
    } else {
        editionsAllowSwipe = true
        editionsTransition = true
    }

    if (document.body.offsetWidth >= 1520) {
        editionsNum = 3
        editionsCount = 3
    } else if (document.body.offsetWidth <= 1520) {
        editionsNum = 2
        editionsCount = 2
    }

    if (body.offsetWidth < 1024) {
        developmentsItem.forEach((el, index) => {
            if (index > 1) {
                el.classList.add('developments_item-hidden')
            }
        })
    } else {
        developmentsItem.forEach((el, index) => {
            if (index <= 2) {
                el.classList.remove('developments_item-hidden')
            }
        })
    }

    if (document.body.offsetWidth > 768) {
        developmentsAllowSwipe = false
        developmentsTransition = false
        developmentsIndex = 0
        developmentsSliderTrack.style.transition = 'none';
    } else {
        developmentsAllowSwipe = true
        developmentsTransition = true
    }
    
    if (document.body.offsetWidth >= 1520) {
        projectNum = 3
    } else if (document.body.offsetWidth < 1520 && document.body.offsetWidth >= 768) {
        projectNum = 2;
    } else if (document.body.offsetWidth <= 767) {
        projectNum = 1;
    };

    tooltipTrigger.forEach((item) => {
        item.addEventListener('mouseover', tooltipOpen);
        item.addEventListener('mouseout', tooltipClose);

        if (document.body.clientWidth >= 1024) {

            item.addEventListener('focus', tooltipOpen);
            item.addEventListener('blur', tooltipClose);

            item.addEventListener('click', tooltipClickOpen);
        }
    })

    projectSliderTrack.style.transform = `translate3d(-${projecSlideIndexh * projecSlideWidth}px, 0px, 0px)`;

    heroSliderTrack.style.transform = `translate3d(-${heroSlideIndex * heroSlideWidth}px, 0px, 0px)`;

    editionsSliderTrack.style.transform = `translate3d(-${editionsSlideIndex * editionsSlideWidth}px, 0px, 0px)`;

    developmentsSliderTrack.style.transform = `translate3d(-${developmentsIndex * developmentsSlideWidth}px, 0px, 0px)`;

    gallerySliderTrack.style.transform = `translate3d(-${gallerySlideIndex * gallerySlideWidth}px, 0px, 0px)`;


})