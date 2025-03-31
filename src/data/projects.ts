export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'paused';
  progress: number;
  link?: string; // опціональне посилання на проект
  technologies?: string[]; // опціональний список використаних технологій
}

// Тут додавайте свої проекти
export const projects: Project[] = [
  // Приклад #1: Поточний проект портфоліо
  {
    id: 1,
    title: "Портфоліо",
    description: "Персональний веб-сайт портфоліо з 3D елементами",
    status: "active",
    progress: 75,
    technologies: ["React", "Three.js", "TypeScript"],
    link: "https://github.com/Difusano18/portfolio"
  },
  {
    id: 2,
    title: "Magick Survival",
    description: "Roguelike гра, де гравець розвиває свого персонажа та вивчає нові магічні здібності. Головна мета - прожити якомога довше у небезпечному світі, що процедурно генерується",
    status: "active",
    progress: 4,
    technologies: ["Python", "Pygame", "Procedural Generation"],
    link: "https://github.com/Difusano18/magick-survival"
  }
];

/* Як додавати новий проект:

1. Скопіюйте шаблон:
{
  id: 2, // Унікальний номер (збільшуйте на 1)
  title: "Назва проекту",
  description: "Опис проекту",
  status: "active", // або "paused"
  progress: 50, // відсоток виконання від 0 до 100
  technologies: ["Tech1", "Tech2"], // використані технології
  link: "https://github.com/..." // посилання на проект
}

2. Вставте в масив projects вище
3. Змініть дані під свій проект
4. Збережіть файл

Примітка: Після додавання проект одразу з'явиться на сайті
*/ 