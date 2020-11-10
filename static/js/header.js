"use strict";
const header = `<header>
<div class="header_wrapper">
    <input type="checkbox" name="show_list" id="show_list" class="show_list visually_hidden">
    <label for="show_list" class="show_list_label">展开列表</label>
    <div class="logo"><a href="/" class="logo_link"><img src="/static/img/three_men_transparent.png" alt="Three men logo"
                class="logo_img"></a></div>
    <ul class="section_list">
        <h1 class="visually_hidden list_title">区域</h1>
        <li class="list_item"><a href="/" class="item_link active">首页</a></li>
        <li class="list_item"><a href="/search" class="item_link">兼职</a></li>
        <li class="list_item"><a href="/ordering_food" class="item_link">食堂订餐</a></li>
        <li class="list_item"><a href="/shopping/buy/" class="item_link">超市代购</a></li>
        <li class="list_item"><a href="/logistic/buy/" class="item_link">快递帮拿</a></li>
    </ul>
    <section class="account_section login_and_register">
    <!-- <section class="account_section login_and_register hidden"> -->
        <a href="/login" class="login account_func">登录</a>
        <a href="/register" class="register account_func">注册</a>
    </section>
    <section class="account_section with_avatar hidden">
    <!-- <section class="account_section with_avatar"> -->
        <a href="/me" class="account">
            <img src="/static/img/default_avatar.png" alt="User avatar" class="avatar">
        </a>
        <div class="avatar_panel">
        <!-- <div class="avatar_panel" style="opacity: 1; pointer-events: all;"> -->
            <div class="avatar_name_wrapper">
                <a href="/me" class="avatar">
                    <img src="/static/img/default_avatar.png" alt="User avatar" class="avatar_img">
                </a>
                <h1 class="nickname">用户名</h1>
            </div>
            <div class="func_list_wrapper">
                <ul class="func_list">
                    <li class="list_item"><a href="#" class="item_link" id="balance">金子余额<span class="balance">0</span></a></li>
                    <li class="list_item"><a href="#" class="item_link" id="recharge">金子充值</a></li>
                    <li class="list_item"><a href="#" class="item_link" id="withdraw">金子提现</a></li>
                    <li class="list_item"><a href="/me/order" class="item_link" id="order">我的订单</a></li>
                    <li class="list_item"><a href="/me" class="item_link" id="verify">兼职认证</a></li>
                    <li class="list_item"><a href="#" class="item_link logout" id="logout">退出登录</a></li>
                </ul>
            </div>
        </div>
    </section>
</div>
</header>
`;
