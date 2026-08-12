# Инструкция по вёрстке HTML-писем из Figma

Применяй эту инструкцию при сборке или изменении адаптивного HTML-письма вместе с email-build checkpoint. Figma-зависимые правила этой инструкции обязательны для `NEW BUILD` и зависящего от дизайна `CONTINUE / FIX`; точечный design-independent технический `CONTINUE / FIX` использует явно указанную ниже исходную regression baseline без обязательных Figma-ссылок.

## Источники спецификации

Для `NEW BUILD` и зависящего от дизайна `CONTINUE / FIX` конкретный инстанс письма определяет, ЧТО должно получиться:

— контент;
— порядок и видимость элементов;
— alignment;
— размеры;
— padding и gaps;
— типографику и цвета;
— изображения, crop и пропорции.

Description компонента определяет, КАК его нужно сверстать:

— структуру таблиц;
— Mobile/Desktop-композицию;
— карточные сетки;
— гибридные колонки;
— переключение вариантов;
— кнопки;
— MSO/VML fallback;
— экспорт конкретных слоёв;
— допустимые Outlook-отличия.

Этот промт определяет глобальные ограничения всего письма. HTML-render используется для проверки результата.

Когда Figma применима, при расхождении визуальных значений следуй конкретному инстансу. Если вопрос относится к реализации компонента — следуй его description внутри глобальных ограничений промта.

Если description нарушает глобальное ограничение:

— сохрани визуальный результат инстанса;
— используй ближайшую совместимую email-реализацию;
— сообщи об отклонении в итоговом ответе.

Не переноси автоматически между Mobile и Desktop alignment, размеры, порядок элементов, gaps, crop, пропорции и видимость.

## Figma-проход по применимости

Для `NEW BUILD` и зависящего от дизайна `CONTINUE / FIX` до написания HTML обязателен этот проход:

1. Получи design context и screenshots подтверждённых Mobile/Desktop-инстансов письма.
2. Определи все смысловые компоненты в contract-audit scope, включая вложенные, и их варианты.
3. Для каждого компонента в contract-audit scope сопоставь с реестром main component / COMPONENT_SET, node ID, используемые варианты и видимую структуру. В `NEW BUILD` contract-audit scope включает все использованные смысловые компоненты; в `CONTINUE / FIX` — затронутые компоненты и потенциально затронутые shared structures.
4. При совпадении используй полную запись реестра как component contract.
5. Изучи геометрию конкретных используемых Mobile/Desktop-вариантов.
6. Читай description / descriptionMarkdown в Figma точечно, если запись или вариант отсутствует, node ID или варианты расходятся, видимая структура противоречит записи, есть признаки изменения дизайна или description, либо реализация остаётся неоднозначной.
7. Присвой каждому полученному contract source: `REGISTRY` либо `FIGMA VERIFIED`.
8. Не верстай смысловой компонент без полученного контракта.

Description атомарного графического asset не обязателен, если его использование полностью определено родительским компонентом.

Если contract смыслового компонента невозможно получить ни из реестра, ни через Figma после исчерпания доступных MCP-способов, остановись, назови компонент и не придумывай его реализацию.

Для design-independent технического `CONTINUE / FIX`:

— Figma context, screenshots, descriptions и визуальное сравнение с Figma не требуются;
— изучи текущие HTML, assets и ссылки;
— используй неизменяемую исходную версию письма как regression baseline;
— применяй registry/component contracts только к компонентам или shared structures, которые фактически затронуты техническим изменением;
— сравни изменённое и незатронутое поведение результата с исходной версией на одинаковых применимых ширинах.

## HTML-документ

Используй:

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html lang="ru"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
```

В `<head>` обязательно:

```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="x-apple-disable-message-reformatting">

<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
```

Добавь:

```css
html {
  -webkit-text-size-adjust: none;
  -ms-text-size-adjust: none;
}
```

Body:

```html
<body class="body" style="margin:0; padding:0;">
```

## Основная обёртка

```html
<table role="presentation"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0">
  <tr>
    <td align="center"
        bgcolor="#F3F3F5"
        style="background-color:#F3F3F5; padding:0 15px;">

      <!--[if (gte mso 9)|(IE)]>
      <table role="presentation"
             width="600"
             cellpadding="0"
             cellspacing="0"
             border="0">
        <tr><td>
      <![endif]-->

      <table role="presentation"
             width="100%"
             cellpadding="0"
             cellspacing="0"
             border="0"
             style="width:100%; max-width:600px; min-width:300px;">
        <tr>
          <td>
            [полноширинный Header или другой полноширинный блок]
          </td>
        </tr>
        <tr>
          <td class="email-padding"
              style="padding-left:16px; padding-right:16px;">
            [обычные контентные блоки]
          </td>
        </tr>
        <tr>
          <td>
            [полноширинный Footer или другой полноширинный блок]
          </td>
        </tr>
      </table>

      <!--[if (gte mso 9)|(IE)]>
        </td></tr>
      </table>
      <![endif]-->

    </td>
  </tr>
</table>
```

email-padding:

— Mobile: 16px;
— Desktop: 24px;
— применяется один раз только к строке или группе обычных контентных блоков, которым нужны общие боковые поля письма.

Перед размещением каждого верхнеуровневого компонента определи его тип по `SCOPE` в description:

— `FULL-WIDTH`: отдельная строка email-wrapper без общего `email-padding`;
— `COMMON-PADDING`: компонент внутри общего `email-padding`, применённого один раз;
— `SELF-INSET`: отдельная полноширинная строка без общего `email-padding`; собственные боковые inset компонента берутся из его description.

Не помещай self-inset-компонент внутрь общего `email-padding` и не объединяй его с обычными padded-компонентами в одну обёртку.

Полноширинные компоненты размещай отдельными строками основной таблицы без `email-padding`. Их внутренние горизонтальные padding бери из конкретных инстансов и descriptions.

Внутренние padding и gaps остальных блоков бери из инстансов и descriptions. Не применяй `email-padding` повторно внутри компонентов.

### Внешние отступы верхнеуровневых компонентов

Для актуальных маркетинговой и сервисной библиотек используй единый внешний ритм без исключений:

— Mobile: верхний отступ `16px`, боковые поля `16px`;
— Desktop: верхний отступ `24px`, боковые поля `24px`.

Эти значения описывают внешний root/inset компонента, а не внутренний padding его карточки или content-area. Внутренние padding, gaps и radius по-прежнему бери из description конкретного компонента и его Mobile/Desktop-варианта.

Для `COMMON-PADDING` боковые `16px`/`24px`, видимые на root компонента в Figma, уже представлены общим `email-padding`. Не добавляй их повторно внутри блока. Верхний `16px`/`24px` реализуй один раз как расстояние перед блоком.

Для `SELF-INSET` компонент размещается вне общего `email-padding` и сам получает верхний и боковые inset: `16px` на Mobile и `24px` на Desktop.

Для `FULL-WIDTH` не добавляй боковой `email-padding`, но сохраняй верхний отступ `16px` на Mobile и `24px` на Desktop. Внутренние горизонтальные padding его секций бери из description.

Не переноси верхний отступ на вложенные компоненты: если блок используется внутри content-area другого компонента, его внешний root/inset не воспроизводится повторно.

## Адаптивность

Обязательный breakpoint: 660px. Не заменяй его на 600px.

Inline-стили являются Mobile-базой.

```css
.d_mobile {
  display: block;
}

.d_desktop {
  display: none;
  max-height: 0;
  overflow: hidden;
}

@media only screen and (max-width:659px) {
  .mob_100 {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .d_none,
  .d_desktop {
    display: none !important;
    max-height: 0 !important;
    overflow: hidden !important;
  }
}

@media only screen and (min-width:660px) {
  .email-padding {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  .d_mobile {
    display: none !important;
    max-height: 0 !important;
    overflow: hidden !important;
  }

  .d_desktop {
    display: block !important;
    max-height: none !important;
    overflow: visible !important;
  }
}
```

Правила применения классов к конкретному компоненту бери из его description.

`d_mobile` и `d_desktop` применяй только к внешним wrapper вариантов, а не к внутренним колонкам.

Для Outlook:

— показывай только Desktop-структуру;
— исключай Mobile-only разметку через non-MSO conditional comments;
— создавай MSO table fallback по description компонента;
— не помещай Outlook-контент внутрь элемента с inline `display:none`.

## Общие ограничения

— Основной layout строй таблицами.
— Для layout-таблиц используй `role="presentation"`.
— Указывай `cellpadding="0"`, `cellspacing="0"`, `border="0"`.
— Критичные стили размещай inline.
— Фоны дублируй через `bgcolor` и `background-color`.
— Кликабельной должна быть вся предусмотренная площадь ссылки или кнопки.
— Не полагайся на margin у `<td>`.
— Не помещай `<table>` внутрь `<a>`.
— Не используй SVG, flex, CSS Grid и JavaScript. Не используй `object-fit` и `object-position` для `@2x`-изображений: их display-размеры рассчитываются пропорционально, а crop выполняется wrapper-контейнером.
— Не используй CSS absolute positioning для обычного layout. Позиционирование внутри MSO/VML fallback разрешено.
— Не используй CSS-перестановку, не поддерживаемую Outlook.
— Конкретную структуру блоков, колонок, карточек, buttons и fallback бери из descriptions.
— VML используй только при реальном тексте поверх CSS background-image и только по description компонента.

## Gmail Android color override

```html
<style type="text/css">
@media only screen and (max-width:480px) {
  u + .body .white-text {
    background-image: linear-gradient(#ffffff, #ffffff);
    background-clip: text;
    color: transparent;
  }

  div > u + .body .white-text {
    background-image: none;
    background-clip: inherit;
    color: #ffffff;
  }

  u + .body .btn-txt {
    background: linear-gradient(#ffffff, #ffffff);
    background-image: linear-gradient(#ffffff, #ffffff);
    background-clip: text;
    color: transparent !important;
  }

  div > u + .body .btn-txt {
    background-image: none;
    background-clip: inherit;
    color: #ffffff !important;
  }
}
</style>
```

`white-text` используй для белого текста на тёмном фоне, `btn-txt` — для белого текста кнопок. 480px — отдельный breakpoint Gmail Android.

## Изображения

Figma-export rules этого раздела применяй, когда in-scope asset требуется получить или повторно экспортировать из Figma. В design-independent техническом `CONTINUE / FIX` неизменяемые существующие assets проверяй и переиспользуй из source baseline; не требуй Figma только ради повторного экспорта незатронутого файла.

Каждый уникальный визуальный asset экспортируй один раз из конкретного Desktop-инстанса письма. Используй один файл и один `src` во всех Mobile/Desktop-вариантах и во всех компонентах письма, где повторяется тот же визуальный asset. Не используй placeholder assets исходных компонентов.

Различай два типа растровых изображений:

1. `DIRECT IMAGE` — изображение отображается в собственном соотношении сторон. Размер файла рассчитывается от Desktop display-размера: ×2 для JPEG и ×4 для PNG. Mobile-инстанс определяет display-размер; адаптивное изображение может использовать `width:100%; height:auto`.
2. `FILL IMAGE` — исходный растр из Fill помещается в отдельные Mobile/Desktop crop-wrapper. Desktop-инстанс определяет фиксированную геометрию Desktop. Размер Mobile image-area `W0×H0` определяет контрольное соотношение сторон и crop, а не фиксированные CSS-размеры. `width:100%; height:auto` допустим только как рассчитанная часть конкретной реализации, а не как универсальная замена Fill-crop.

### @4x

Все логотипы, иконки, бейджи и остальные assets, отмеченные `@4x`, экспортируй только в PNG ×4 с сохранением исходной прозрачности и без фоновой matte-подложки.

Цветовой профиль: sRGB. Формат экспорта должен сохранять alpha-канал там, где asset содержит прозрачные области. Если фактический export boundary полностью закрыт предусмотренным видимым Fill, итоговое изображение может быть непрозрачным — не удаляй этот Fill и не добавляй искусственные прозрачные пиксели.

Различай:

— `ASSET OWNER` — ближайший семантический слой с `@4x` в имени; он определяет базовое имя файла;
— `EXPORT BOUNDARY` — конкретный внешний или вложенный слой, который description требует экспортировать; только он определяет содержимое PNG.

### Способ экспорта @4x

NODE-ассеты экспортируй через Figma Plugin API непосредственно из фактического `EXPORT BOUNDARY`:

```js
node.exportAsync({
  format: "PNG",
  contentsOnly: true,
  colorProfile: "SRGB",
  constraint: { type: "SCALE", value: 4 }
})
```

`download_assets`, `get_screenshot`, screenshot всего компонента, crop из screenshot, browser screenshot и любой другой уже скомпозированный рендер запрещено использовать как финальный NODE-asset.

Для исходного IMAGE Fill используй оригинальный source-файл, если именно это требует description компонента.

Нельзя сначала отрендерить родительский компонент, а затем вырезать из него иконку. Такой способ сводит прозрачность с фоном родителя.

### EXPECTED ALPHA

Перед экспортом каждого `@4x` asset определи `EXPECTED ALPHA`:

— `TRANSPARENT` — у export boundary нет собственного видимого Fill, закрывающего всю его область;
— `OPAQUE` — собственный видимый Fill export boundary действительно закрывает всю область и входит в asset по description;
— `SOURCE` — прозрачность определяется оригинальным source-файлом IMAGE Fill.

Fill родителя не участвует в определении `EXPECTED ALPHA`.

Если собственный Fill export boundary имеет `visible=false`, asset считается `TRANSPARENT`, даже если на холсте под ним виден белый, серый или цветной фон родителя.

Правила фона:

— учитывай только видимые Fill фактического export boundary;
— Fill с `visible=false` не является подложкой и не должен попадать в результат;
— если у export boundary нет видимого фонового Fill, пространство вокруг artwork должно быть прозрачным;
— не добавляй белую, серую, цветную или иную подложку самостоятельно;
— не своди прозрачность с фоном письма;
— не наследуй Fill родительского layout- или button-контейнера;
— не включай padding и пустое пространство родителя;
— если у самого export boundary есть видимый Fill и description включает этот слой целиком, сохрани Fill без изменений;
— видимые круги, градиенты, рамки и фоновые фигуры внутри экспортируемого artwork сохраняй как часть asset.

Существующий export preset родительского слоя не отменяет export boundary, заданный description компонента.

### Проверка alpha-канала

Наличие цветового режима RGBA само по себе не доказывает наличие прозрачности. PNG с `alpha=255` во всех пикселях является полностью непрозрачным.

Для каждого PNG после экспорта программно проверь:

— минимальное и максимальное значение alpha;
— количество пикселей с `alpha < 255`;
— RGBA четырёх угловых пикселей.

Для `EXPECTED ALPHA = TRANSPARENT` обязательно:

— количество пикселей с `alpha < 255` должно быть больше нуля;
— если artwork не касается углов export boundary, alpha углов должен быть равен `0`.

Если эти условия не выполнены, экспорт считается ошибочным и задача не может быть завершена.

Для `EXPECTED ALPHA = SOURCE` сначала проверь alpha оригинального source-файла IMAGE Fill, затем сравни его с итоговым PNG. Не определяй прозрачность source-файла по его виду на фоне компонента.

### Проверка на контрастных подложках

Каждый PNG с `EXPECTED ALPHA = TRANSPARENT` или прозрачным `SOURCE` проверь минимум на трёх подложках:

— белой;
— чёрной;
— яркой контрастной, например magenta или checkerboard.

Белая, серая или цветная подложка является ошибкой только тогда, когда она отсутствует в изолированном экспорте фактического `EXPORT BOUNDARY` и попала из родительского layout/button-контейнера.

Собственный видимый Fill `EXPORT BOUNDARY`, предусмотренный description, сохраняется и не считается matte-ошибкой.

Проверка только внутри готового письма на исходном фоне недостаточна.

### Постобработка PNG

При добавлении sRGB-профиля, изменении metadata или оптимизации PNG запрещено:

— конвертировать изображение через RGB;
— выполнять flatten или composite;
— подкладывать matte/background;
— пересобирать PNG через canvas с непрозрачным фоном.

После любой постобработки повтори alpha-аудит. Значения alpha до и после обработки не должны измениться.

Используй один файл и один `src` для Mobile и Desktop. HTML-атрибуты width/height равны Desktop display-размерам конкретного размещения; отображаемый размер Mobile-варианта задаётся вёрсткой компонента. Не добавляй `width:100%`.

```html
<img src="images/name@4x.png"
     width="[DESKTOP DISPLAY WIDTH]"
     height="[DESKTOP DISPLAY HEIGHT]"
     alt="[ALT]"
     style="display:block; border:0;">
```

### @2x

Фотографии, скриншоты, изображения карточек и баннеры экспортируй в JPEG @2x.

Следующий шаблон применяется только к `DIRECT IMAGE`. Для `FILL IMAGE` используй отдельный контракт раздела `@2x Fill`.

```html
<img src="images/name@2x.jpg"
     width="[DESKTOP DISPLAY WIDTH]"
     height="[DESKTOP DISPLAY HEIGHT]"
     alt="[ALT]"
     style="display:block; width:100%; height:auto; border:0;">
```

— цветовой профиль: sRGB;
— начальное качество: 82%;
— при заметных артефактах повышай качество до 90%;
— для `DIRECT IMAGE` на Mobile то же изображение масштабируется по ширине контейнера с `width:100%; height:auto`.

После экспорта сравни JPEG с Figma в фактическом display-размере и проверь читаемость деталей, отсутствие заметных артефактов, правильные цвета, crop и пропорции.

### @2x Fill

Если description требует экспортировать исходный растр из Fill:

— извлеки оригинальное изображение из Fill указанного слоя конкретного Desktop-инстанса;
— не экспортируй контейнер image-area;
— не обрезай исходный файл под Desktop-контейнер;
— сохрани полное исходное изображение, его пиксельные размеры и пропорции;
— перекодируй его в JPEG по общим правилам качества и sRGB;
— не создавай отдельный Mobile-файл;
— используй один и тот же `src` во всех вариантах.

Mobile и Desktop реализуй отдельными внешними wrapper изображения. Crop, масштаб и позицию бери из соответствующего инстанса, но не интерпретируй контрольную высоту Mobile как фиксированную CSS-высоту.

#### Mobile responsive crop

Размер Mobile image-area `W0×H0` является контрольным размером из Figma и задаёт соотношение сторон `W0:H0`. Это не фиксированные CSS `width` и `height`.

Mobile crop-wrapper:

— занимает `100%` доступной ширины;
— не получает фиксированную высоту в px;
— не получает HTML-атрибут `height` на wrapper, содержащем `td` или `table`;
— изменяет высоту пропорционально фактической ширине:

```text
actualHeight = actualWidth * H0 / W0
```

Пропорциональное `<img>` оставляй в обычном потоке документа: `display:block`, одна управляющая ось, вторая рассчитывается из исходного соотношения сторон или задаётся `auto`. Именно фактическая высота изображения должна формировать высоту Mobile crop-wrapper. Не используй абсолютное позиционирование, которое исключает изображение из потока.

Для горизонтального Fill-crop, когда исходный растр шире Mobile wrapper:

```text
Rs = sourceWidth / sourceHeight
Rc = W0 / H0
imgWidthPercent = Rs / Rc * 100%
imgHeight = auto
```

При таком размере высота пропорционального изображения совпадает с адаптивной высотой wrapper, а лишняя ширина обрезается через `overflow:hidden`. Горизонтальное положение воспроизводи процентным смещением по Fill соответствующего Mobile-инстанса.

Если `Rs < Rc` и требуется вертикальный crop, не заменяй адаптивную высоту фиксированным значением в px и не деформируй изображение. Используй проверенный в целевых клиентах пропорциональный wrapper либо пропорциональный нерастянутый fallback с тем же `src`.

#### Desktop crop

Desktop crop-wrapper может использовать фиксированные пиксельные размеры или высоту строки из Desktop-инстанса. Для Desktop рассчитай пропорциональный размер изображения отдельно:

```text
Rs = sourceWidth / sourceHeight
Rc = wrapperWidth / wrapperHeight

если Rs >= Rc:
  imgHeight = wrapperHeight
  imgWidth  = wrapperHeight * Rs
  wrapper обрезает лишнюю ширину

если Rs < Rc:
  imgWidth  = wrapperWidth
  imgHeight = wrapperWidth / Rs
  wrapper обрезает лишнюю высоту
```

Во всех вариантах фактические CSS-размеры и HTML-атрибуты `width` и `height` самого `<img>` должны сохранять соотношение сторон исходного файла. Округляй рассчитанные display-размеры согласованно до целых пикселей с погрешностью не более одного пикселя. Crop выполняется только wrapper-контейнером вокруг уже пропорционально рассчитанного изображения.

Для `FILL IMAGE` запрещены:

— одновременное приравнивание width и height `<img>` к width и height wrapper;
— `height:100%` на `<img>`;
— `object-fit`, `object-position` и `@supports`-правила, которые подгоняют коробку `<img>` под wrapper;
— фиксированная высота `<img>` при адаптивно изменяющейся ширине;
— фиксированная высота Mobile crop-wrapper;
— HTML-атрибут `height` на Mobile wrapper, `td` или `table`, ограничивающий рост image-area;
— интерпретация контрольного Mobile-размера `W0×H0` как неизменяемых CSS-размеров;
— абсолютное позиционирование Mobile `<img>`, из-за которого оно перестаёт формировать высоту wrapper;
— деформация растра ради точного совпадения с crop-wrapper.

Если crop-wrapper или позиционирование не поддерживаются клиентом, используй пропорциональный нерастянутый fallback с тем же `src`. Другой crop или изменение высоты блока в fallback допустимы; деформация изображения недопустима. Pixel-perfect crop в старом Outlook не требуется, если это отдельно не запрошено.

### Выбор слоя

По умолчанию экспортируй визуальный слой с `@2x` или `@4x` в имени. Не экспортируй layout-контейнер, если он добавляет padding, пустое пространство, HTML-контент или фон, который не входит в asset.

Конкретный слой определяй по description и структуре Desktop-инстанса.

Имя файла определяй по ближайшему семантическому asset-контейнеру с `@2x` или `@4x` в имени, даже если description требует экспортировать вложенный визуальный слой. Не используй generic-имя вложенного `Vector`, `Subtract`, `Group` или аналогичного технического слоя как имя файла.

Например, при экспорте внутреннего `Vector` из `google-play-icon @4x` файл должен называться `google-play-icon@4x.png`, а не `Vector@4x.png`.

Сохраняй обязательный суффикс `@2x` или `@4x` в имени файла. Не удаляй его и не добавляй `Mobile`/`Desktop`, если description не требует отдельного файла.

Если один визуальный asset повторяется в нескольких компонентах письма, не экспортируй его повторно: используй существующий файл и тот же `src`.

Перед удалением дубликата проверь, что в HTML на него больше нет ссылок.

Не оставляй временные Figma MCP URLs в готовом HTML.

## Типографика и геометрия

Шрифт: Roboto, Arial, sans-serif.

Roboto подключай через Google Fonts для поддерживающих клиентов. Сохрани корректный Arial fallback.

Для `NEW BUILD` и зависящего от дизайна `CONTINUE / FIX` все визуальные значения бери из конкретных Mobile/Desktop инстансов:

— font-size;
— font-weight;
— line-height;
— letter-spacing;
— colors;
— text-align;
— размеры;
— padding и gaps;
— border-radius;
— alignment.

Не заменяй точные значения приблизительными дизайн-токенами. В design-independent техническом `CONTINUE / FIX` сохраняй существующие визуальные значения из неизменяемой исходной версии, кроме значений, которые прямо входят в точный технический scope.

## Доступность

— Содержательные изображения должны иметь осмысленный alt.
— Декоративные изображения должны иметь `alt=""`.
— Все href должны быть заполнены.
— Не создавай ссылку без href.
— Добавь preheader, если он предусмотрен письмом или CRM-шаблоном.

## Структура архива

```text
template_name/
├── email.html
└── images/
```

Пути к изображениям относительные:

```html
src="images/name@2x.jpg"
src="images/name@4x.png"
```

## Проверка

Для `NEW BUILD` и зависящего от дизайна `CONTINUE / FIX` отрендери HTML минимум на ширинах:

— 358px;
— 659px;
— 660px;
— Desktop не менее 700px.

В этих design-backed маршрутах сделай Mobile и Desktop screenshots готового HTML и сравни их с соответствующими screenshots Figma.

Для design-independent технического `CONTINUE / FIX` отрендери исходную и изменённую версии на одинаковых ширинах, применимых к изменению и его regression risk. Если изменение затрагивает responsive behavior или общую обёртку, включи все четыре указанные выше ширины. Сравни изменённое и незатронутое поведение с исходной версией; Figma screenshots и сравнение с ними не требуются.

Проверь:

— порядок и видимость элементов;
— alignment текста и кнопок;
— размеры, crop и пропорции изображений;
— padding и gaps;
— каждый верхнеуровневый блок имеет ровно один внешний верхний отступ: `16px` Mobile / `24px` Desktop;
— у `COMMON-PADDING` боковые `16px`/`24px` не продублированы внутри компонента;
— у `SELF-INSET` верхний и боковые inset равны `16px` Mobile / `24px` Desktop;
— у `FULL-WIDTH` нет общего бокового `email-padding`, а внутренние padding секций не подменены внешним inset;
— типографику и цвета;
— border-radius;
— переключение Mobile/Desktop вариантов;
— отсутствие горизонтального скролла;
— `document.scrollWidth` не превышает viewport;
— все локальные src существуют;
— временные Figma MCP URLs отсутствуют;
— форматы, размеры, качество, crop и пропорции экспортированных изображений соответствуют правилам и Figma;
— каждый уникальный визуальный asset представлен одним файлом, если description явно не требует иного;
— один и тот же asset использует одинаковый `src` во всех Mobile/Desktop-вариантах и повторных вхождениях;
— для Fill-изображений проверены размеры контейнеров, crop, масштаб, позиция и отсутствие растяжения во всех вариантах;
— `FILL IMAGE` не использует `height:100%`, `object-fit`, `object-position` или одновременное приравнивание width и height изображения к wrapper;
— соотношение HTML-атрибутов `width` и `height` каждого `FILL IMAGE` совпадает с соотношением сторон исходного файла;
— соотношение фактических CSS-размеров width/height каждого `FILL IMAGE` совпадает с соотношением сторон исходного файла в пределах погрешности округления не более одного пикселя;
— пропорционально рассчитанный `<img>` полностью перекрывает crop-wrapper хотя бы по одной оси, а лишняя часть обрезается только wrapper;
— при изменении Mobile viewport адаптивные width и height каждого `@2x`-изображения изменяются с одинаковым коэффициентом;
— Mobile crop-wrapper не имеет фиксированной высоты в px и не ограничен HTML-атрибутом `height` на wrapper, `td` или `table`;
— Mobile crop-wrapper проверен минимум на двух ширинах: его высота изменяется с тем же коэффициентом, что и ширина, а отношение `actualWidth / actualHeight` совпадает с контрольным `W0 / H0` с погрешностью не более одного пикселя;
— отсутствуют отдельные Mobile/Desktop-дубликаты изображений без прямого требования description;
— все `@4x` assets экспортированы в PNG ×4 с цветовым профилем sRGB;
— исходная прозрачность `@4x` assets сохранена и не сведена с matte-цветом;
— если у фактического export boundary нет видимого Fill, фон PNG остаётся прозрачным;
— скрытые Fill не превратились в подложку;
— фон присутствует только тогда, когда он входит в фактический export boundary;
— Fill, padding и пустое пространство родительских layout/button-контейнеров не попали в PNG;
— ни один `@4x` asset не получен через `get_screenshot`, screenshot компонента, browser screenshot или crop из скомпозированного рендера;
— для каждого `@4x` asset зафиксированы `ASSET OWNER`, точный `EXPORT BOUNDARY` и `EXPECTED ALPHA`;
— для каждого PNG программно проверены диапазон alpha, число пикселей с `alpha < 255` и RGBA углов;
— каждый PNG с ожидаемой прозрачностью проверен на белой, чёрной и контрастной подложках;
— alpha-канал не изменился после добавления sRGB-профиля или другой постобработки;
— имя файла взято из semantic asset owner, а не из generic-имени вложенного `Vector`, `Subtract` или `Group`;
— все `<img>` имеют width, height и alt;
— все href заполнены;
— соблюдены глобальные ограничения;
— не использованы placeholder assets;
— размер HTML контролируется с учётом риска Gmail clipping.

Задачу запрещено завершать и архивировать, если хотя бы для одного `@4x` asset:

— не зафиксирован export boundary;
— не определён `EXPECTED ALPHA`;
— использован screenshot-crop или другой скомпозированный рендер;
— `EXPECTED ALPHA` не совпадает с фактической статистикой PNG;
— PNG с ожидаемой прозрачностью не проверен на контрастных подложках.

В `NEW BUILD` и зависящем от дизайна `CONTINUE / FIX` не завершай задачу при заметных визуальных расхождениях с Figma. В design-independent техническом `CONTINUE / FIX` не завершай задачу, если изменённое поведение не соответствует точному scope или незатронутое поведение регрессирует относительно неизменяемой исходной версии на применимых ширинах.

## Outlook и dark mode

Поддерживай базовую читаемость и Desktop-структуру в MSO Outlook, но не усложняй письмо отдельными VML-композициями и дублированной разметкой ради pixel-perfect соответствия, если это прямо не требуется description или задачей.

VML используй только при реальном HTML-тексте поверх фонового изображения либо при отдельном явном требовании.

Отсутствие pixel-perfect crop, overlap или скруглений в старом Outlook не является блокером завершения. Не допускаются потеря содержимого, неработающие ссылки и критически разрушенная структура.

Если реальный Outlook, Litmus или Email on Acid недоступен, выполни статический аудит только фактически присутствующей MSO/VML-разметки, но не утверждай, что Outlook-render протестирован.

Статически проверь:

— баланс conditional comments;
— корректность conditional tables;
— Desktop-структуру для Outlook;
— исключение Mobile-only разметки;
— наличие MSO/VML fallback, только если он требуется description или задачей;
— соответствие размеров фактически используемого VML конкретному Desktop-блоку.

Если доступны Outlook-compatible или dark-mode renderers, используй их и сообщи результат.

Не утверждай, что такая проверка выполнена, если соответствующий renderer не запускался.

## Итоговый ответ

В итоговом ответе:

— для write route дай ссылки на созданные файлы или архив;
— для write route подтверди получение contracts всех компонентов в contract-audit scope; для `NEW BUILD` scope включает все использованные смысловые компоненты; для read-only ответа упоминай contract audit только если он относился к вопросу;
— укажи, какие contracts взяты из реестра, а какие проверялись в Figma, если Figma была применима;
— перечисли только отсутствующие contracts, конфликты и осознанные отклонения;
— укажи выполненные viewport-проверки, если они требовались или фактически выполнялись;
— укажи, выполнялся ли реальный Outlook/dark-mode render или только статический аудит, если такая проверка относилась к задаче;
— не пересказывай descriptions без необходимости.

## Ссылки в футере

RuStore:
https://redirect.appmetrica.yandex.com/serve/461821467231807192

Huawei App Gallery:
https://redirect.appmetrica.yandex.com/serve/1038282229081536966

Get Apps:
https://redirect.appmetrica.yandex.com/serve/29475923791277577

Google Play:
https://redirect.appmetrica.yandex.com/serve/533879077140969685

Служба поддержки:
mailto:help@cupis.ru

Сайт:
https://1cupis.ru/
