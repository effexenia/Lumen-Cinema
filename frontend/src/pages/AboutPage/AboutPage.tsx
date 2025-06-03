import React from "react";
import styles from "./AboutPage.module.css";
import logo from "../../assets/logo.png";

const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      <header className={styles.header}>
        <img src={logo} alt="LumenCinema Logo" className={styles.logo} />
        <h1 className={styles.title}>LumenCinema</h1>
        <p className={styles.subtitle}>Де кожен кадр — емоція</p>
      </header>

      <section className={styles.intro}>
        <p>
          <strong>LumenCinema</strong> — це сучасний кінотеатр, заснований у 2010 році в самому серці Києва. Від початку нашої діяльності ми ставили собі за мету створити не просто кінозал, а культурний простір, де кожен відвідувач відчуває атмосферу мистецтва, затишку та передових технологій.
        </p>
        <p>
          Завдяки системам <strong>Dolby Atmos</strong>, <strong>4K-проекторам</strong> та ергономічним кріслам, наші гості насолоджуються кінематографом на найвищому рівні. Лаунж-зона з авторськими напоями, просторе фойє, команда професіоналів — усе створено для вашого комфорту та емоційних вражень.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Наші зали</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Зал «Орфей»</h3>
            <p>150 місць, панорамний екран, система Dolby Atmos.</p>
          </div>
          <div className={styles.card}>
            <h3>Зал «Аполлон»</h3>
            <p>80 місць, комфортні крісла, індивідуальні навушники.</p>
          </div>
          <div className={styles.card}>
            <h3>Зал «Ніка»</h3>
            <p>VIP-зона з 40 кріслами, обслуговування на місці, приватна атмосфера.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Події</h2>
        <ul className={styles.eventList}>
          <li><strong>Кіно-вечір "Фільми 90-х"</strong> — щомісяця у залі «Орфей».</li>
          <li><strong>Нічний кіноквіз</strong> — випробуйте свої знання у світі кіно!</li>
          <li><strong>Зустрічі з режисерами</strong> — відкриті обговорення після прем’єр.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Наша команда</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Олександра Іваненко</h3>
            <p>Директорка кінотеатру. Стратегія, розвиток, натхнення.</p>
          </div>
          <div className={styles.card}>
            <h3>Василь Бариста</h3>
            <p>Бариста, що знає, який капучино підходить до Нолана, а який — до Андерсона.</p>
          </div>
          <div className={styles.card}>
            <h3>Ігор Технік</h3>
            <p>Відповідальний за звук, світло і магію на екрані.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Галерея</h2>
        <div className={styles.gallery}>
          <img src="/gallery/hall.jpg" alt="Інтер'єр залу" />
          <img src="/gallery/lounge.jpg" alt="Лаунж зона" />
          <img src="/gallery/popcorn.jpg" alt="Бар з попкорном" />
          <img src="/gallery/viewers.jpg" alt="Глядачі в залі" />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.contacts}>
          <h3>Контакти</h3>
          <p><strong>Адреса:</strong> м. Київ, вул. Кіностудійна, 10</p>
          <p><strong>Телефон:</strong> +38 (044) 123-45-67</p>
          <p><strong>Електронна пошта:</strong> info@lumencinema.ua</p>
          <p><strong>Instagram / Facebook:</strong> @lumencinema</p>
        </div>
        <p className={styles.callToAction}>Чекаємо на вас у світі кіно!</p>
      </footer>
    </div>
  );
};

export default AboutPage;
