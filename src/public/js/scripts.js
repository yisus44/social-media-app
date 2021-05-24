$("post-comment-form").hide();

$("#btn-like").click(function (e) {
  e.preventDefault();
  let imageId = $(this).data("id");
  $.post("/images/" + imageId + "/like").done((data) => {
    $(".likes-count").text(data.likes);
  });
});

$("btn-toggle-comment").click(function (e) {
  e.preventDefault();
  $("#post-comment-form").slideToggle();
});

$("#btn-delete").click(function (e) {
  e.preventDefault();
  let $this = $(this);
  let response = confirm("Are you sure you want to delete this post?");
  if (response) {
    let imageId = $this.data("id");
    $.ajax({
      url: "/images/" + imageId,
      type: "DELETE",
    }).done(function (result) {
      $this.removeClass("btn-danger").addClass("btn-success");
      $this.find("i").removeClass("fa-times").addClass("fa-check");
      $this.text("<span><Deleted!/span>");
    });
  } else {
  }
});
