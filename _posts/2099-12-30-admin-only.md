---
title: Admin Only
author: Seanleeee13
date: 2099-12-30
category: class
layout: post
---

<form>
Password: <input id="password" type="password" id="password"><br>
<input type="button" value="Confirm" id="confirm">
</form>
<div id="div"></div>

<script type="text/javascript">
  var btn = document.getElementById("confirm");
  var pswd = document.getElementById("password");
  var div = document.getElementById("div");
  var add = false;

  btn.addEventListener("click", function() {
    if (pswd.value == "drowssap") {
      div.innerHTML = "<a href=\"https://docs.google.com/forms/d/1dglxEnO3Uq9pGc56zSYoccN2YD5sWn0q3UxPcI6Z-c4/edit\">Link</a>"
    } else {
      alert("Incorrect Password");
    }
  })
</script>
