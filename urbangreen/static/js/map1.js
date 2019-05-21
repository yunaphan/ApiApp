require([
        "esri/Basemap",
        "esri/Map",
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
        "esri/widgets/Search",
        "esri/widgets/Search/SearchViewModel",
        "esri/widgets/Locate",
        // "esri/widgets/Editor",
        "dojo/_base/array",
        "dojo/dom",
        "dojo/domReady!"
    ], function (
    Basemap,
    Map,
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
    Search,
    SearchVM,
    Locate,
    // Editor,
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
                    id: "search-around",
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

        function showPopupUBG(target) {
            objectid = target.graphic.attributes.OBJECTID;
            let UBGinfo = target.graphic.attributes;
            let content = '';
            let params = {};
            params['SoHieu'] = UBGinfo.SoHieu;
            // let _token = $('meta[name="csrf-token"]').attr('content');
            content += "<table class='esri-widget__table'>";
            content += "<tr><th>Số Hiệu </th><td>" + UBGinfo.SoHieu + "</td></tr>";
            content += "<tr><th>Tên Cây Xanh</th><td>" + UBGinfo.MaTenCX + "</td></tr>";
            // content += "<tr><th>Địa bàn </th><td>" + (UBGinfo.DiaBan) + "</td></tr>";
            content += "<tr><th>Kinh độ </th><td>" + (UBGinfo.KinhDo != null ? parseFloat(UBGinfo.KinhDo) : '(Rỗng)') + "</td></tr>";
            content += "<tr><th>Vĩ độ </th><td>" + (UBGinfo.ViDo != null ? parseFloat(UBGinfo.ViDo) : '(Rỗng)') + "</td></tr>";
            content += "<tr><th>Đường Kính </th><td>" + parseFloat(UBGinfo.DuongKinh) + "</td></tr>";
            content += "<tr><th>Chiều Cao </th><td>" + parseFloat(UBGinfo.ChieuCao) + "</td></tr>";
            content += "<tr><th>Độ Rộng Tán </th><td>" + parseFloat(UBGinfo.DoRongTan != null ? UBGinfo.DoRongTan : '(Rỗng)') + "</td></tr>";
            content += "<tr><th>Ngày Trồng </th><td>" + (UBGinfo.NgayTrong != null ? formatDate(UBGinfo.NgayTrong) : '(rỗng)') + "</td></tr>";
            content += "<tr><th>Ngày Cập Nhật </th><td>" + formatDate(UBGinfo.NgayCapNhat) + "</td></tr>";
            content += "<tr><th>Thuộc Tính </th><td>" + (UBGinfo.ThuocTinh != null ? UBGinfo.ThuocTinh : '(rỗng)') + "</td></tr>";
            content += "<tr><th>Ghi Chú </th><td>" + UBGinfo.GhiChu + "</td></tr>";
            // content += "<tr><th>Deleted </th><td>" + (UBGinfo.Deleted != null ? UBGinfo.Deleted : '(rỗng)') + "</td></tr>";
            // content += "<tr><th>Tình Trạng </th><td>" + (UBGinfo.TinhTrang != null ? UBGinfo.ThuocTinh : '(rỗng)') + "</td></tr>";
            content += "<tr><th>Tuyến Đường </th><td>" + UBGinfo.TuyenDuong + "</td></tr>";
            content += "<tr><th>NVKS_X </th><td>" + (UBGinfo.NVKS_X != null ? UBGinfo.NVKS_X : '(rỗng)') + "</td></tr>";
            content += "<tr><th>NVKS_Y </th><td>" + (UBGinfo.NVKS_Y != null ? UBGinfo.NVKS_Y : '(rỗng)') + "</td></tr>";
            content += "<tr><th>Người Cập Nhật </th><td>" + (UBGinfo.NguoiCapNhat != null ? UBGinfo.NguoiCapNhat : '(rỗng)') + "</td></tr>";
            content += "</table>";
            return content;
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
            index: 2
        });
        searchWidget.includeDefaultSources = false;
        searchWidget.locationEnabled = false;

        var $container = $('#gallery-content-center');


        function showToBox(long, lat) {
            var popupDiv = document.createElement("div");
            var outsideDiv = document.createElement("div");
            outsideDiv.setAttribute('class', 'list-group');
            var themcay = document.createElement("button");
            themcay.setAttribute("class", "list-group-item");
            themcay.innerHTML = "Thêm Cây Mới";
            themcay.setAttribute("id", "themcaymoi");
            themcay.onclick = function () {
                window.open(BASE_URL + 'UBG/create/' + long + '&' + lat, '_blank');
            };
            outsideDiv.appendChild(themcay);
            return outsideDiv;
        }

        view.when(function () {
            view.on("click", function (event) {
                view.popup.open({
                    title: "<b>Thêm Cây Mới </b>",
                    location: event.mapPoint,
                    content: showToBox(event.mapPoint.longitude, event.mapPoint.latitude),
                });
            });

            function create_new_point(input) {
                UBGGraphhics.removeAll();
                $.each(input, function (key, value) {
                    var point = {
                        type: "point",
                        longitude: value.long,
                        latitude: value.lat
                    };

                    var TextSymBol = {
                        type: Text,
                        color: "#003eba",
                        haloColor: "#000000",
                        haloSize: "0.5px",
                        xoffset: 0,
                        yoffset: 0,
                        font: {  // autocast as new Font()
                            size: 10,
                            family: "sans-serif",
                            weight: "bold"
                        }
                    };
                    let lable = new Graphic({
                        geometry: point,
                        symbol: TextSymbol
                    });
                    UBGGraphhics.add(lable);
                })
            }
        });


        $(document).ready(function () {
            $('#myInput').keyup(function () {
                event.preventDefault();
                var message = $(this).val();
                $.ajax({
                    url: 'searchqh',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        message: message
                    },
                    success(data) {
                        console.log(data.resultqh[0]);
                        console.log('length: ', data.resultqh.length);
                        if (data.resultqh.length > 0) {
                            $('.listqh').html('');
                            for (var i = 0; i < data.resultqh.length; i++) {
                                const data_new = data.resultqh[i];
                                $('.listqh').append('<li class="item-qh" value="' + data_new["0"] + '">' + data_new["1"] + ' - Mã: ' + data_new["0"] + '</li>');

                            }
                            $('#btn-search').click(function () {
                                console.log(data.resultqh);
                            })
                        }
                    }
                })
                    .done(function () {
                        console.log("success");
                    })
                    .fail(function () {
                        console.log("error");
                    })
                    .always(function () {
                        console.log("complete");
                    });

            });
            $(document).on('click', '.item-qh', function () {
                const value = $(this).attr('value');
                var params = {};
                params["searchObject"] = "ubg";
                params["searchField"] = [];
                params["searchValue"] = value;
                $.ajax({
                    url: 'searchlayer',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        object: params["searchObject"],
                        field: params["searchField"],
                        value: value
                    },
                    success(data) {
                        console.log('data',data)
                    }
                })
                    .done(function () {
                        console.log("success");
                    })
                    .fail(function () {
                        console.log("error");
                    })
                    .always(function () {
                        console.log("complete");
                    });
                 console.log('value',value);
            });


        });

    }
);