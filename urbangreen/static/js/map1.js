require([
    "esri/Basemap",
    "esri/Map",
    "esri/Graphic",
    "esri/views/MapView",
    "esri/layers/WebTileLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/GroupLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/tasks/Locator",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/FeatureForm",
    "esri/widgets/Search",
    "esri/widgets/Search/SearchViewModel",
    "esri/widgets/Editor",
    "esri/widgets/Locate",
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/domReady!"
], function (
    Basemap,
    Map,
    Graphic,
    MapView,
    WebTileLayer,
    MapImageLayer,
    GroupLayer,
    FeatureLayer,
    GraphicsLayer,
    Locator,
    BasemapGallery,
    Expand,
    LayerList,
    FeatureForm,
    Search,
    SearchVM,
    Editor,
    Locate,
    Query,
    QueryTask,
    arrayUtils,
    dom
) {

    let quanHuyen = {};
    let objectid = '';
    //    define UBGFeatureURL
    let UBGFeatureURL = "/arcgis/rest/services/DoThi/CayXanh/FeatureServer/0";

    //Load google map via WebtileLayer arcGIS js
    let wordImage = new WebTileLayer({
        id: 'wordimagery',
        urlTemplate: 'https://mt1.google.com/vt/lyrs=y&x={col}&y={row}&z={level}',
        title: 'Google Map'
    });
    let streetImage = new WebTileLayer({
        id: 'streetimagery',
        urlTemplate: 'https://mt1.google.com/vt/lyrs=m&x={col}&y={row}&z={level}',
        title: 'Google Map'
    });
    let topoImage = new WebTileLayer({
        id: 'topoimagery',
        urlTemplate: 'https://mt1.google.com/vt/lyrs=p&x={col}&y={row}&z={level}',
        title: 'Google Map'
    });

    //Use layer as basemap
    let satellitebasemap = new Basemap({
        baseLayers: [wordImage],
        title: "Vệ Tinh",
        id: "satellite",
        thumbnailUrl: BASE_URL + "static/images/Thumbnai/satellite.png"
    });
    let streetbasemap = new Basemap({
        baseLayers: [streetImage],
        title: "Đường Phố",
        id: "street",
        thumbnailUrl: BASE_URL + "static/images/Thumbnai/Streets1.PNG"
    });
    let topobasemap = new Basemap({
        baseLayers: [topoImage],
        title: "Địa Hình",
        id: "street",
        thumbnailUrl: BASE_URL + "static/images/Thumbnai/Topo.PNG"
    });

    //Define map object
    let map = new Map({
        basemap: "osm"
    });
    //view
    let view = '';
    view = new MapView({
        map: map,
        container: "viewDiv",
        center: [106.366362, 10.360622],
        zoom: 15,
        popup: {
            dockEnabled: false,
            dockOptions: {
                position: "bottom-right",
                breakpoint: false,
            }
        }
    });

    //BasemapGallery
    let basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div"),
        source: [
            satellitebasemap,
            streetbasemap,
            topobasemap,
        ]
    });

    let bgExpand = new Expand({
        view: view,
        content: basemapGallery,
        expandTooltip: "Bản Đồ Nền",
        expandIconClass: "esri-icon-basemap"
    });
    view.ui.move(["zoom", bgExpand], "bottom-right");
    view.ui.add(bgExpand, "bottom-right");

    let UBGGraphhics = new GraphicsLayer({
        listMode: "hide",
    });
    map.add(UBGGraphhics);

    let QuanHuyenLayer = new MapImageLayer({
        url: "https://tigis.vbgis.vn/arcgis/rest/services/NenTienGiang/QuanHuyen/MapServer",
        title: "Quận huyện",
        labelsVisible: true
    });
    let PhuongXaLayer = new MapImageLayer({
        url: "https://tigis.vbgis.vn/arcgis/rest/services/NenTienGiang/PhuongXa/MapServer",
        title: "Phường xã",
        labelsVisible: true
    });
    var hanhChinhGroupLayer = new GroupLayer({
        title: "Hành chính",
        visible: true,
        visibilityMode: "independent",
        layers: [QuanHuyenLayer, PhuongXaLayer],
    });
    map.add(hanhChinhGroupLayer);

    var layerList = new LayerList({ //On-of layers
        view: view,
        listItemCreatedFunction: function (event) {
            const item = event.item;
            // if (item.title == "Trạm BTS") {
            //     item.panel = {
            //         content: "legend",
            //         open: false
            //     };
            // }
            if (item.title === "Phường xã") {
                item.visible = false;
            }
        },
    });
    var layerListExpand = new Expand({
        view: view,
        content: layerList,
        expandTooltip: "Lớp bản đồ hành chính",
        expandIconClass: "esri-icon-collection"
    });
    view.ui.add(layerListExpand, "bottom-right");

    let UBGFeatureLayer = new FeatureLayer({
        url: map_url + UBGFeatureURL,
        // labelingInfo: [labelClass],
        title: "Cây Xanh",
        outFields: ["*"],
        popupTemplate: {
            title: "Cây {SoHieu} - {MaTenCX}",
            content: showPopupUBG,
            actions: [{
                id: "showImg",
                title: "Xem hình ảnh",
                className: "esri-icon-media"
            }, {
                id: "update-infor-tree",
                title: "Cập nhật thông tin cây xanh",
                className: "esri-icon-edit"
            }, {
                id: "edit",
                title: "Tới trang chỉnh sửa",
                className: "esri-icon-home"
            }]
        }
    });
    map.add(UBGFeatureLayer);

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    let searchWidget = new Search({
        view: view,
        sources: [{
            featureLayer: UBGFeatureLayer,
            searchFields: ["SoHieu", "MaTenCX"],
            displayField: "SoHieu",
            suggestionTemplate: "{MaTenCX}-{SoHieu}",
            exactMatch: false,
            maxResults: 10,
            outFields: ["*"],
            suggestionsEnabled: true,
            minSuggestCharacters: 0,
            placeholder: "Tên Cây Xanh Hoặc Số Hiệu của cây xanh",
            name: "Tìm theo Tên hoặc Số Hiệu Của Cây Xanh",
            locationEnabled: false,
            resultSymbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [226, 119, 40],
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 2
                }
            }
        }]
    });
    view.ui.add(searchWidget, {
        position: "bottom-right",
        index: 3
    });
    searchWidget.includeDefaultSources = false;
    searchWidget.locationEnabled = false;

    function showPopupUBG(target1) {
        // objectid = target1.graphic.attributes.OBJECTID;
        let UBGinfo = target1.graphic.attributes;
        let content = '';
        let params = {};
        params['SoHieu'] = UBGinfo.SoHieu;
        // let _token = $('meta[name="csrf-token"]').attr('content');
        content += "<table class='esri-widget__table'>";
        content += "<tr><th>Số Hiệu </th><td>" + UBGinfo.SoHieu + "</td></tr>";
        content += "<tr><th>Tên Cây Xanh</th><td>" + UBGinfo.MaTenCX + "</td></tr>";
        content += "<tr><th>Kinh độ </th><td>" + (UBGinfo.KinhDo != null ? parseFloat(UBGinfo.KinhDo) : '(Rỗng)') + "</td></tr>";
        content += "<tr><th>Vĩ độ </th><td>" + (UBGinfo.ViDo != null ? parseFloat(UBGinfo.ViDo) : '(Rỗng)') + "</td></tr>";
        content += "<tr><th>Đường Kính </th><td>" + parseFloat(UBGinfo.DuongKinh) + "</td></tr>";
        content += "<tr><th>Chiều Cao </th><td>" + parseFloat(UBGinfo.ChieuCao) + "</td></tr>";
        content += "<tr><th>Độ Rộng Tán </th><td>" + parseFloat(UBGinfo.DoRongTan != null ? UBGinfo.DoRongTan : '(Rỗng)') + "</td></tr>";
        content += "<tr><th>Ngày Trồng </th><td>" + (UBGinfo.NgayTrong != null ? formatDate(UBGinfo.NgayTrong) : '(rỗng)') + "</td></tr>";
        content += "<tr><th>Ngày Cập Nhật </th><td>" + formatDate(UBGinfo.NgayCapNhat) + "</td></tr>";
        content += "<tr><th>Thuộc Tính </th><td>" + (UBGinfo.ThuocTinh != null ? UBGinfo.ThuocTinh : '(rỗng)') + "</td></tr>";
        content += "<tr><th>Ghi Chú </th><td>" + UBGinfo.GhiChu + "</td></tr>";
        content += "<tr><th>Tuyến Đường </th><td>" + UBGinfo.TuyenDuong + "</td></tr>";
        content += "<tr><th>NVKS_X </th><td>" + (UBGinfo.NVKS_X != null ? UBGinfo.NVKS_X : '(rỗng)') + "</td></tr>";
        content += "<tr><th>NVKS_Y </th><td>" + (UBGinfo.NVKS_Y != null ? UBGinfo.NVKS_Y : '(rỗng)') + "</td></tr>";
        content += "<tr><th>Người Cập Nhật </th><td>" + (UBGinfo.NguoiCapNhat != null ? UBGinfo.NguoiCapNhat : '(rỗng)') + "</td></tr>";
        content += "</table>";
        return content;
    }

    let highlight, editFeature;
    view.when(function (event) {
        view.popup.autoOpenEnabled = true;//disable popups
        var editor = new Editor({
            view: view,
        });
        $(document).on('click', '.add_tree', function () {
            view.ui.add(editor, 'top-right');
            $(this).toggle();
            $('.close_add_tree').toggle()
        });
        $(document).on('click', '.close_add_tree', function () {
            view.ui.remove(editor);
            $(this).toggle();
            $('.add_tree').toggle();
        });

        $(document).on('click', '.search_td', function () {
            var query = new Query({
                returnGeometry: true,
                outFields: ["*"],
                returnGeometry: true,
                outFields: ["*"],
                outSpatialReference: {wkid: 102100}
            });

            query.where = "MaTenCX = 'SAO'";
            // execute query
            qTask.execute(query).then(function (results) {
                UBGGraphhics.removeAll();
                view.popup.close();
                results.features.forEach(function (result) {
                    var graphic = new Graphic({
                        geometry: result.geometry,
                        attributes: result.attributes,
                        symbol: {
                            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                            width: 2,
                            color: "green",
                        },
                        popupTemplate: {
                            title: "Cây {SoHieu} - {MaTenCX}",
                            content: "{*}",
                        }
                    });
                    view.graphics.add(graphic);
                    map.remove(UBGFeatureLayer);
                });
            })
                .otherwise(function (e) {
                    console.log(e);
                });
            $(this).toggle();
            $('.close_search').toggle();
        });
        $(document).on('click', '.close_search', function () {
            view.graphics.removeAll();
            map.add(UBGFeatureLayer);
            $(this).toggle();
            $('.search_td').toggle();
        });


        var popup = view.popup;
        popup.viewModel.on('trigger-action', function (event) {
            if (event.action.id === "update-infor-tree") {
                const target = event.target;
                selectFeature(
                    target.features[0].attributes["OBJECTID"]
                );
            }

        });
        view.on("click", function (event) {
            console.log('click', event);
            view.hitTest(event).then(function (response) {
                const results = response.results;
                if (
                    results.length > 0
                ) {

                } else {
                    document.getElementById("update").classList.add("esri-hidden");
                    create_tree1(
                        results[0].graphic.attributes["OBJECTID"]
                    )


                }
            })
            // document.getElementById("update").classList.add("esri-hidden");
        })

    });

    var form = new FeatureForm({
        container: "formDiv",
        groupDisplay: "sequential",
        layer: UBGFeatureLayer,
        fieldConfig: [
            {
                lable: "information 1",
                description: "This is information 1",
                fieldConfig: [
                    {
                        lable: "Số Hiệu",
                        name: "SoHieu"
                    },
                    {
                        lable: "Tên Cây Xanh",
                        name: "MaTenCX"
                    }
                ]
            },
            {
                lable: "Information 2!",
                description: "This is information 2!",
                fieldConfig: [
                    {
                        lable: "Tình Trạng Cây Xanh",
                        name: "MaTinhTrang"
                    },
                    {
                        lable: "Kinh Độ",
                        name: "KinhDo"
                    },
                    {
                        lable: "Vĩ Độ",
                        name: "ViDo"
                    }
                ]
            }
        ]
    });


    function selectFeature(objectId) {
        // query feature from the server
        UBGFeatureLayer
            .queryFeatures({
                objectIds: [objectId],
                outFields: ["*"],
                returnGeometry: true
            })
            .then(function (results) {
                if (results.features.length > 0) {
                    editFeature = results.features[0];

                    // display the attributes of selected feature in the form
                    form.feature = editFeature;

                    // highlight the feature on the view
                    view.whenLayerView(editFeature.layer).then(function (layerView) {
                        highlight = layerView.highlight(editFeature);
                    });

                    if (
                        document
                            .getElementById("update")
                            .classList.contains("esri-hidden")
                    ) {
                        // document.getElementById("info").classList.add("esri-hidden");
                        document
                            .getElementById("update")
                            .classList.remove("esri-hidden");
                    }
                }
            });
    }

    function create_tree1(objectId) {
        // query feature from the server
        UBGFeatureLayer
            .queryFeatures({
                objectIds: [objectId],
                outFields: ["*"],
                returnGeometry: true
            })
            .then(function (results) {
                if (results.features.length > 0) {}
                else{
                    editFeature = results.features[0];

                    // display the attributes of selected feature in the form
                    form.feature = editFeature;

                    // highlight the feature on the view
                    view.whenLayerView(editFeature.layer).then(function (layerView) {
                        highlight = layerView.highlight(editFeature);
                    });

                    if (
                        document
                            .getElementById("update")
                            .classList.contains("esri-hidden")
                    ) {
                        // document.getElementById("info").classList.add("esri-hidden");
                        document
                            .getElementById("update")
                            .classList.remove("esri-hidden");
                    }
                }
            });
    }

    view.ui.add("update", "top-right");
    view.ui.add("create", "top-right");
    var qTask = new QueryTask({
        url: "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/CayXanh/FeatureServer/0"
    });

    function drawPoint(x, y) {
        let point = {
            type: "point",
            longitude: x,
            latitude: y
        };

        let sym = {
            type: "simple-marker",
            color: "green",
            width: 10
        };

        let graphic = new Graphic({
            geometry: point,
            symbol: sym
        });

        view.graphics.add(graphic);
    }


});