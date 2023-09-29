// Credit to Jeffalo.net

const buttons = document.querySelectorAll('.fancy-button')
buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
        let x = e.clientX - e.target.offsetLeft
        let y = e.clientY - e.target.offsetTop

        let ripples = document.createElement('span')
        ripples.className = 'ripples'
        ripples.style.left = x + 'px'
        ripples.style.top = y + 'px'
        this.appendChild(ripples)

        setTimeout(() => {
            ripples.remove()
        }, 400)
    })
})
