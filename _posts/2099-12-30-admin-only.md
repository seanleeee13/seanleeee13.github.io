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
      div.innerHTML = "<a href=\"https://docs.google.com/forms/d/1ZybN_R4wiIy-9YkIi4wYl1y0xCGIpzALUBCLt9APqec/edit\">Day 4 Quiz Link</a>"
    } else {
      alert("Incorrect Password");
    }
  })
</script>
