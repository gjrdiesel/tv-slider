## Add a tv slider custom module to Accrisoft Freedom

Instructions for Acrisoft Freedom v11

#Installation

1) Add a custom module
    1) Go to Green -> Toolbar, click "Add Custom Module"
    2) Name it `TV Slider`, choose "use custom sort order (order by item)"
    3) Click save
    4) Go to "Fields" next to "Configuration" in the sub tabs
    5) Add these four fields
        1) Name (Text Input *Required), set field to `name`
        2) Link (Text Input), set field to `misc0`
        3) Image (Image Input), set field to `misc1`
        4) Show for Seconds (Number Input *Width: 5) set field to `misc2`
2) Setup layout
    1) Go to Green -> Layouts -> Modules
    2) Scroll down to `TV Slider (Custom)`
    3) Edit `[Lister]`
    4) For "Body" enter the following:    
    ```html
    [[repeat]]
    <div id="root"></div>
    <script src="https://cdn.rawgit.com/gjrdiesel/tv-slider/c2dd3b2e25c951c49c710216a8cf4a6602703796/build/static/js/main.bad0867f.js"></script>
    ```
    5) For "Repeat" enter:
    ```html
    <script type="text/template" class="tv-slider-items">
    [[item]]
    </script>
    ``` 
    5) For "Item" enter:
    ```html
    {"name": "[[name]]",
    "link": "[[misc0]]",
    "image": "[[misc1_src]]",
    "timeout": [[misc2]]}
    ``` 
    6) Click save
    
That's it! Now view your lister `your-site-here.com/index.php?src=directory&view=tv_slider`