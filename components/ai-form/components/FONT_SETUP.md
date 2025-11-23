# Настройка шрифта с поддержкой кириллицы для PDF

## Проблема
Стандартные шрифты PDF (Helvetica, Times-Roman) не поддерживают кириллицу в react-pdf, что приводит к отображению нечитаемых символов (кракозябры).

## Текущее решение

Код автоматически пытается загрузить шрифт Roboto с поддержкой кириллицы из CDN. Если это не работает, используется Helvetica как fallback.

## Если кириллица все еще не отображается правильно

### Вариант 1: Использование локального шрифта (Рекомендуется - 100% работает)

1. **Скачайте шрифт Roboto с поддержкой кириллицы:**
   - Перейдите на https://fonts.google.com/specimen/Roboto
   - Скачайте Regular и Bold версии
   - Или используйте прямые ссылки:
     - Regular: https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf
     - Bold: https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf

2. **Создайте папку и поместите файлы:**
   ```
   public/
     fonts/
       Roboto-Regular.ttf
       Roboto-Bold.ttf
   ```

3. **Код уже настроен** - он автоматически попытается использовать локальные файлы, если CDN не работает.

### Вариант 2: Использование DejaVu Sans (альтернатива)

1. Скачайте DejaVu Sans: https://dejavu-fonts.github.io/Download.html

2. Поместите файлы в `public/fonts/`:
   ```
   public/
     fonts/
       DejaVuSans.ttf
       DejaVuSans-Bold.ttf
   ```

3. Обновите `analysis-pdf-document.tsx`, заменив 'Roboto' на 'DejaVuSans' в функции `registerCyrillicFont()`.

## Проверка

После добавления шрифта:
1. Перезапустите dev server
2. Сгенерируйте PDF
3. Проверьте, что кириллица отображается правильно

## Примечание

Если CDN не работает (из-за CORS или блокировки), обязательно используйте Вариант 1 с локальными файлами шрифтов.

