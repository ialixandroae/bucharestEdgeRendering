require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/SceneLayer",
    "esri/Color",
    "esri/widgets/Expand",
    "dojo/domReady!"
], function(
    Map, SceneView, SceneLayer, Color, Expand
){

    const divBtnSolid = document.getElementById('btnSolid');
    const divBtnSketch = document.getElementById('btnSketch');
    const divNoEdge = document.getElementById('btnNoEdge');


    const solidEdges = {
        type: "solid",
        color: [0, 0, 0, 0.6],
        size: 1
    };

    const sketchEdges = {
        type: "sketch",
        color: [0, 0, 0, 0.4],
        size: 1.2,
        extensionLength: 6
    };

    var renderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
            type: "mesh-3d",
            symbolLayers: [{
                type: "fill",
                material: {
                    color: "#ffffff",
                    colorMixMode: "replace"
                },
                edges: solidEdges
            }]
        }
    };
    

    const map = new Map({
        basemap: "dark-gray",
        ground: "world-elevation"
    });

    const sceneLayer = new SceneLayer({
        portalItem: {
            id: "8176da5c760542599bc232e782ff296e"
        },
        popupEnabled: false,
        renderer: renderer
    });
    
    map.add(sceneLayer);

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: [26.10, 44.39, 5000],
            tilt: 45
        }
    });

    divBtnSolid.addEventListener('click', () => {
        
        _toggleCheckboxes(document.getElementById('inputSolidEdge'), [document.getElementById('inputSketchEdge'), document.getElementById('noEdges')])
        const rangeValue = ((document.getElementById('rangeSolid').value) / 10);
        const colorValue = document.getElementById('solidColorPicker').value;
    
        const solidColor = new Color("#" + colorValue.toString());

        const solidEdgesClone = {
            type: "solid",
            color: solidColor,
            size: rangeValue
        };
        _applyRenderer(solidEdgesClone);
        
    });

    divBtnSketch.addEventListener('click', () => {
        _toggleCheckboxes(document.getElementById('inputSketchEdge'), [document.getElementById('inputSolidEdge'), document.getElementById('noEdges')])
        const  rangeValue = ((document.getElementById('rangeSketch').value) / 10);
        const colorValue = document.getElementById('sketchColorPicker').value;
        const sketchColor = new Color("#" + colorValue.toString());
        const sketchEdgesClone = {
            type: "sketch",
            color: sketchColor,
            size: rangeValue,
            extensionLength: parseInt(rangeValue)
        };
        _applyRenderer(sketchEdgesClone);
    });

    divNoEdge.addEventListener('click', () => {
        _toggleCheckboxes(document.getElementById('noEdges'), [document.getElementById('inputSketchEdge'), document.getElementById('inputSolidEdge')])
        
        _applyRenderer(null);
    });


    const layerListExpand = new Expand({
        expandIconClass: "icon-ui-applications",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
        // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
        view: view,
        content: document.getElementById("controls")
    });

    view.ui.add(layerListExpand, "top-right");

    function _toggleCheckboxes( checkboxTrue, checkboxFalse) {
        if(!checkboxTrue.checked){
            checkboxTrue.checked = true;
        }
        checkboxFalse.forEach(chckbox => {
            if (chckbox.checked) {
                chckbox.checked = false;
            }
        })
    }

    function _applyRenderer(edges){
        const cloneRenderer = sceneLayer.renderer.clone();
        cloneRenderer.symbol.symbolLayers.getItemAt(0).edges = edges;
        sceneLayer.renderer = cloneRenderer;
    }

});