let header_tel_num1 = document.querySelectorAll('.header-bot_inner_wthreeinfo_header_mid .nomer')[0]
let header_tel_num2 = document.querySelectorAll('.header-bot_inner_wthreeinfo_header_mid .nomer')[1]

if (header_tel_num1 != null) {
    header_tel_num1.innerHTML = `<div class="nomer"><a href="tel:87252399900">8(7252) <span>39-99-00</span></a></div>`
    header_tel_num2.innerHTML = `<div class="nomer"><a href="tel:87019447700">8(701) <span>944-77-00</span></a></div>`
}


let community_poll = document.querySelector('.community-poll')

if (community_poll != null) {
    community_poll.innerHTML = `
                    <p class="bgf">Контакты</p>
                    <div class="swit form">
                        <p><b>г. Шымкент</b></p>
                        <p> ул. Мадели кожа 35/1, (уг.ул. Байтурсынова) 1-этаж, бизнес-центр BNK</p>
                        <p><a href="tel:87252399900">8(7252) 39-99-00</a></p>
                        <p><a href="tel:87019447700">+7 (701) 944-77-00</a></p>
                        <p><a href="tel:87051549900">+7 (705) 154-99-00</a></p>
                        <p>Email: shymkent@idiamarket.kz</p>
                    </div>`
}


let footer_address = document.querySelector('.footer .w3-address')

if (footer_address != null) {
    footer_address.innerHTML = `
                    <div class="w3-address-grid">
                    <div class="w3-address-left">
                        <i class="fa fa-phone" aria-hidden="true"></i>
                    </div>
                    <div class="w3-address-right">
                        <p style="margin:0">Телефон:</p>
                        <p><a href="tel:87252399900">8 (7252) 39-99-00</a></p>
                        <p><a href="tel:87019447700">+7 (701) 944-77-00</a></p>

                    </div>
                    <div class="clearfix"> </div>
                    </div>
                    <div class="w3-address-grid">
                        <div class="w3-address-left">
                            <i class="fa fa-envelope" aria-hidden="true"></i>
                        </div>
                        <div class="w3-address-right">
                            <p style="margin:0">Email</p>
                            <p><a href="mailto:shymkent@idiamarket.kz"> shymkent@idiamarket.kz</a></p>
                        </div>
                        <div class="clearfix"> </div>
                    </div>
                    <div class="w3-address-grid">
                        <div class="w3-address-left">
                            <i class="fa fa-map-marker" aria-hidden="true"></i>
                        </div>
                        <div class="w3-address-right">
                            <p style="margin:0">Адрес</p>
                            <p>ул. Мадели кожа 35/1, (уг.ул. Байтурсынова) 1-этаж, бизнес-центр BNK

                            </p>
                        </div>
                        <div class="clearfix"> </div>
                    </div>
                    <div id="socialMedia" class="span3 pull-right">
                        <a href="https://www.youtube.com/channel/UCNDMIviMuZOhhCP7xoxGYAA/videos"><img width="50" height="50" src="../images/youtube.png" title="youtube" alt="youtube" /></a>
                        <a href="https://www.instagram.com/idiamarket/"><img width="50" height="50" src="../images/insta.png" title="instagram" alt="instagram"></a>
                    </div>`
}