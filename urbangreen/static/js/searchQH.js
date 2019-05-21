//
//
// $(document).ready(function () {
//     $('#myInput').keyup(function () {
//         event.preventDefault();
//         var message = $(this).val();
//         $.ajax({
//             url: 'searchqh',
//             type: 'GET',
//             dataType: 'json',
//             data: {
//                 message: message
//             },
//             success(data) {
//                 console.log(data.resultqh[0]);
//                 console.log('length: ', data.resultqh.length);
//                 if (data.resultqh.length > 0) {
//                     $('.listqh').html('');
//                     for (var i = 0; i < data.resultqh.length; i++) {
//                         const data_new = data.resultqh[i];
//                         $('.listqh').append('<li class="item-qh" value="' + data_new["0"] + '">' + data_new["1"] + ' - Mã: ' + data_new["0"] + '</li>');
//
//                     }
//                     $('#btn-search').click(function () {
//                         console.log(data.resultqh);
//                     })
//                 }
//             }
//         })
//             .done(function () {
//                 console.log("success");
//             })
//             .fail(function () {
//                 console.log("error");
//             })
//             .always(function () {
//                 console.log("complete");
//             });
//
//     });
//     $(document).on('click', '.item-qh', function () {
//         const value = $(this).attr('value');
//         console.log(value);
//     });
//
//
// });
