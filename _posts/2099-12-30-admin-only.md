---
title: Admin Only
author: Seanleeee13
date: 2099-12-30
category: class
layout: post
---

<form>
Password: <input id="password" type="password" id="password"><br>
<input type="button" text="Confirm" id="confirm">
</form>
<div id="div"></div>

<script type="text/javascript">
  var btn = document.getElementById("confirm");
  var pswd = document.getElementById("password");
  var div = document.getElementById("div");

  btn.addEventListener("click", function() {
    if (pswd.value == "drowssap") {
      const div2 = document.createElement("div");
      div2.append("<a href=\"https://docs.google.com/forms/d/1dglxEnO3Uq9pGc56zSYoccN2YD5sWn0q3UxPcI6Z-c4/edit\">Link</a>");
      div.append(div);
    } else {
      alert("Incorrect Password");
    }
  })
</script>
