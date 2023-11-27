window.addEventListener('DOMContentLoaded', () => {
    // Не создавать больше одного экземпляра.
    new ViewController(newCards).call();
})

const newCards = [
    {
      src: './images/card-icons/qualified-icon.png',
      alt: 'qualified-icon',
      title: 'Квалифицированные специалисты',
      desc: 'Высококвалифицированная команда специалистов с аттестацией'
    },
    {
      src: './images/card-icons/key-icon.png',
      alt: 'key-icon',
      title: 'Оснащение все под ключ',
      desc: 'Комплексное оснащение - все под ключ более 683 предприятий во всех регионов РК'
    },
    {
      src: './images/card-icons/product-icon.png',
      alt: 'product-icon',
      title: 'Огромный выбор товара',
      desc: 'У нас есть все виды оборудования для автоматизации любого вида торговли'
    },
    {
      src: './images/card-icons/service-icon.png',
      alt: 'equipment-icon',
      title: 'Сервисное обслуживание',
      desc: 'Технические специалисты помогут вам настроить оборудование под ваши требования'
    },
    {
      src: './images/card-icons/ten-icon.png',
      alt: 'ten-icon',
      title: '10 лет на рынке',
      desc: 'Предоставление услуг высокого качества более 10 лет'
    }
  ];

  // Компонент Card
  class Card {
    constructor(card, parent) {
      this.card = card;
      this.parent = document.querySelector(parent);
    }
  
    render() {
      const el = document.createElement('div');
  
      this.element = 'new_card';
      el.classList.add(this.element);
  
      el.innerHTML = `
               <div class="cardP_img"> <img src="${this.card.src}" alt="${this.card.alt}"> </div>
                <div class="new_card_text_wrapper">
                    <span>${this.card.title}</span>
                    <p>${this.card.desc}</p>
                </div>
      `
      this.parent.append(el);
    }
  }


//   Класс ViewController отвечает за отображение компонента в HTML шаблоне. 
  
//   Для работы с ним необходимо в конструктор класса передать аргумент типа any. Далее, внутри класса
//   есть метод call(), все компоненты класса вызывать внутри него. 

  class ViewController {
    constructor(props) {
      this.props = props;
    }
  
    call() {
      this.props.map((card) => {
        new Card(card, '.new_cards_parent').render();
      })
    }
  
  }