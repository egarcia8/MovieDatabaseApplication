$(document).ready(function () {
    /* var id = @Html.Raw(Newtonsoft.Json.JsonConvert.SerializeObject(Model, Newtonsoft.Json.Formatting.Indented));*/
    var id = window.ratingEditObj.ratingId;

    $("#ratingEditForm").validate({
        rules: {
            ratingEdit: {
                required: true
            }
        },
        messages: {
            ratingEdit: {
                required: "You must enter a rating."
            }
        }
    });

    console.log(id);
    $(".spinner-border").show();
    $(".form-group").hide();
    $.ajax({
        type: "GET",
        url: "/Ratings/EditRatings/" + id,
        dataType: "json",
        crossDomain: "true",
        success: function (result) {
            $(".spinner-border").hide();
            $("#ratingEdit").val(result.rating);
            $(".form-group").show();
        },
        error: function () {
            window.location.replace("/ErrorPage");
        }
    });



    window.onEditRating = function () {
        var newRating = $("#ratingEdit").val();
        var ratingObj = {
            rating: newRating
        };

        const isValid = $("#ratingEditForm").valid();

        if (isValid) {
            $.ajax({
                type: "PUT",
                url: "https://localhost:7252/api/Ratings?ratingId=" + id,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(ratingObj),
                dataType: "json",
                success:
                    $("#editModal").modal("show")
            });
        }

    }

    window.onEditAgain = function () {
        location.reload();
    }

    window.onBack = function () {
        window.location.href = "/Ratings";

        return false;
    }
});