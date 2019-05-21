$(document).ready(function () {
    $("#themcay").click(function (event) {
        event.preventDefault();
        var SoHieu = $('#SoHieu').val();
        if( SoHieu == "" || SoHieu == "undefined")
            alert("Bạn Phải Nhập Số Hiệu");
            $('#SoHieu').focus();
        console.log(SoHieu);
        var long = $('#long').val();
        var lat = $('#lat').val();
        var NgayTrong = $('#NgayTrong').val();
        var NgayCapNhat = $('#NgayCapNhat').val();
        var thuocTinh = $('#thuocTinh').val();
        var MaTenCX = $('#TenCX').children('option:selected').val();
        var MaTinhTrang = $('#MaTinhTrang').children('option:selected').val();
        var TuyenDuong = $('#TuyenDuong').val();
        var GhiChu = $('#GhiChu').val();
        var DuongKinh = $('#DuongKinh').val();
        var ChieuCao = $('#ChieuCao').val();
        var DoRongTan = $('#DoRongTan').val();
        var NVKS_X = $('#NVKS_X').val();
        var NVKS_Y = $('#NVKS_Y').val();

         $.ajax({
               url: 'http://127.0.0.1:8000/ubg/themcayxanh/',
               type: 'POST',
               dataType: 'json',
               data:{
                   SoHieu: SoHieu,
                   lat: lat,
                   long: long,
                   NgayTrong: NgayTrong,
                   NgayCapNhat: NgayCapNhat,
                   thuocTinh: thuocTinh,
                   MaTenCX: MaTenCX,
                   MaTinhTrang: MaTinhTrang,
                   TuyenDuong: TuyenDuong,
                   GhiChu: GhiChu,
                   DuongKinh: DuongKinh,
                   ChieuCao: ChieuCao,
                   DoRongTan: DoRongTan,
                   NVKS_X: NVKS_X,
                   NVKS_Y: NVKS_Y,
                   csrfmiddlewaretoken: '{{ csrf_token }}'
               },
               success: function  (data) {
                   console.log(data)
               }
           });
        //alert(long);
    });
});