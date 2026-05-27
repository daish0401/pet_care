"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

const prices: Record<string, Record<string, string>> = {
  "清爽基础洗": {
    "小型犬": "¥88 起",
    "中大型犬": "¥138 起",
    "猫咪": "¥128 起"
  },
  "精致造型洗剪": {
    "小型犬": "¥168 起",
    "中大型犬": "¥268 起",
    "猫咪": "到店评估"
  },
  "皮毛舒缓护理": {
    "小型犬": "¥128 起",
    "中大型犬": "¥198 起",
    "猫咪": "¥168 起"
  },
  "猫咪轻护理": {
    "小型犬": "请选择猫咪",
    "中大型犬": "请选择猫咪",
    "猫咪": "¥128 起"
  }
};

function cx(classNames: string): string {
  return classNames
    .trim()
    .split(/\s+/)
    .map((name) => styles[name] ?? name)
    .join(" ");
}

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const menuToggle = root.querySelector<HTMLButtonElement>("#menuToggle");
    const navLinks = root.querySelector<HTMLElement>("#navLinks");
    const petType = root.querySelector<HTMLSelectElement>("#petType");
    const serviceSelect = root.querySelector<HTMLSelectElement>("#serviceSelect");
    const timeSelect = root.querySelector<HTMLSelectElement>("#timeSelect");
    const dateInput = root.querySelector<HTMLInputElement>("#dateInput");
    const form = root.querySelector<HTMLFormElement>("#bookingForm");
    const toast = root.querySelector<HTMLElement>("#toast");
    const summaryPet = root.querySelector<HTMLElement>("#summaryPet");
    const summaryService = root.querySelector<HTMLElement>("#summaryService");
    const summaryTime = root.querySelector<HTMLElement>("#summaryTime");
    const summaryPrice = root.querySelector<HTMLElement>("#summaryPrice");
    const baiduMapImage = root.querySelector<HTMLImageElement>("#baiduMapImage");
    const baiduMapFallback = root.querySelector<HTMLElement>("#baiduMapFallback");

    if (
      !menuToggle ||
      !navLinks ||
      !petType ||
      !serviceSelect ||
      !timeSelect ||
      !dateInput ||
      !form ||
      !toast ||
      !summaryPet ||
      !summaryService ||
      !summaryTime ||
      !summaryPrice
    ) {
      return;
    }

    const today = new Date();
    today.setDate(today.getDate() + 1);
    dateInput.min = today.toISOString().slice(0, 10);

    let toastTimer: ReturnType<typeof window.setTimeout> | undefined;

    const updateSummary = () => {
      const pet = petType.value;
      const service = serviceSelect.value;
      summaryPet.textContent = pet;
      summaryService.textContent = service;
      summaryTime.textContent = timeSelect.value;
      summaryPrice.textContent = prices[service]?.[pet] ?? "请咨询";
    };

    const showToast = (message: string) => {
      toast.textContent = message;
      toast.classList.add(styles.show);

      if (toastTimer) {
        window.clearTimeout(toastTimer);
      }

      toastTimer = window.setTimeout(() => {
        toast.classList.remove(styles.show);
      }, 3600);
    };

    const handleMapError = () => {
      if (!baiduMapImage || !baiduMapFallback) return;
      baiduMapImage.hidden = true;
      baiduMapFallback.hidden = false;
    };

    const handleMenuToggle = () => {
      const isOpen = navLinks.classList.toggle(styles.open);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    };

    const handleNavLinksClick = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest("a")) {
        navLinks.classList.remove(styles.open);
        menuToggle.setAttribute("aria-expanded", "false");
      }
    };

    const handleControlChange = () => {
      updateSummary();
    };

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);
      const owner = String(data.get("owner") ?? "您");
      const date = String(data.get("date") ?? "");
      const time = String(data.get("time") ?? "");

      showToast(`${owner}，已生成 ${date} ${time} 的预约信息。`);
      form.reset();
      updateSummary();
    };

    if (baiduMapImage && baiduMapFallback) {
      baiduMapImage.addEventListener("error", handleMapError);
    }

    menuToggle.addEventListener("click", handleMenuToggle);
    navLinks.addEventListener("click", handleNavLinksClick);

    const controls: HTMLSelectElement[] = [petType, serviceSelect, timeSelect];
    controls.forEach((control) => {
      control.addEventListener("change", handleControlChange);
    });

    form.addEventListener("submit", handleSubmit);
    updateSummary();

    return () => {
      if (baiduMapImage && baiduMapFallback) {
        baiduMapImage.removeEventListener("error", handleMapError);
      }

      menuToggle.removeEventListener("click", handleMenuToggle);
      navLinks.removeEventListener("click", handleNavLinksClick);

      controls.forEach((control) => {
        control.removeEventListener("change", handleControlChange);
      });

      form.removeEventListener("submit", handleSubmit);

      if (toastTimer) {
        window.clearTimeout(toastTimer);
      }
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      <header className={cx("site-header")}>
          <nav className={cx("nav")} aria-label="主导航">
            <a className={cx("brand")} href="#top" aria-label="沐爪宠物洗护店首页">
              <span className={cx("brand-mark")} aria-hidden="true">
                <svg className={cx("icon")} viewBox="0 0 24 24">
                  <path d="M11.4 5.4c.7 1.5.2 3.2-1.1 3.8s-2.9-.2-3.6-1.7-.2-3.2 1.1-3.8 2.9.2 3.6 1.7Z" />
                  <path d="M17.3 7.5c-.7 1.5-2.3 2.3-3.6 1.7s-1.8-2.3-1.1-3.8 2.3-2.3 3.6-1.7 1.8 2.3 1.1 3.8Z" />
                  <path d="M6.1 12.5c1.1.8 1.5 2.2.8 3.1s-2.1.9-3.2.1-1.5-2.2-.8-3.1 2.1-.9 3.2-.1Z" />
                  <path d="M20.3 12.6c-.7.9-2.1.9-3.2.1s-1.5-2.2-.8-3.1 2.1-.9 3.2-.1 1.5 2.2.8 3.1Z" />
                  <path d="M7.6 19.2c.5-2.4 2.1-4.4 4.4-4.4s3.9 2 4.4 4.4c.2.9-.5 1.8-1.4 1.8H9c-.9 0-1.6-.9-1.4-1.8Z" />
                </svg>
              </span>
              <span>沐爪宠物洗护</span>
            </a>
            <button id="menuToggle" className={cx("menu-toggle")} type="button" aria-label="打开导航菜单" aria-expanded="false">
              <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>
            <div className={cx("nav-links")} id="navLinks">
              <a href="#services">服务</a>
              <a href="#pricing">价目</a>
              <a href="#gallery">环境</a>
              <a href="#booking">预约</a>
              <a href="#location">门店</a>
              <a href="#contact">联系</a>
            </div>
          </nav>
        </header>
      
        <main id="top">
          <section className={cx("hero")} aria-label="沐爪宠物洗护店">
            <div className={cx("hero-inner")}>
              <div className={cx("hero-copy")}>
                <p className={cx("eyebrow")}>独立洗护间 · 可视化护理 · 猫狗分时段接待</p>
                <h1>四月宠物洗护店</h1>
                <p>从温和沐浴到精致造型，为猫咪和狗狗安排安静、干净、节奏舒适的护理体验。</p>
                <div className={cx("hero-actions")}>
                  <a className={cx("btn btn-primary")} href="#booking">
                    <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M3 10h18" />
                      <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                    </svg>
                    立即预约
                  </a>
                  <a className={cx("btn btn-secondary")} href="#services">
                    <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 7c-1.5 0-2.8.8-3.5 2" />
                      <path d="M4 7c1.5 0 2.8.8 3.5 2" />
                      <path d="M12 5v14" />
                      <path d="M7 12h10" />
                      <path d="M7.5 19h9" />
                    </svg>
                    查看服务
                  </a>
                </div>
                <div className={cx("hero-badges")} aria-label="店铺优势">
                  <span className={cx("badge")}>一宠一巾</span>
                  <span className={cx("badge")}>低噪吹水</span>
                  <span className={cx("badge")}>护理前评估</span>
                </div>
              </div>
            </div>
          </section>
      
          <section className={cx("trust-strip")} aria-label="关键数据">
            <div className={cx("wrap")}>
              <div className={cx("trust-grid")}>
                <div className={cx("trust-item")}>
                  <strong>45min</strong>
                  <span>小型犬基础洗护起</span>
                </div>
                <div className={cx("trust-item")}>
                  <strong>12+</strong>
                  <span>细分护理检查项</span>
                </div>
                <div className={cx("trust-item")}>
                  <strong>1:1</strong>
                  <span>洗护师全程照看</span>
                </div>
                <div className={cx("trust-item")}>
                  <strong>20:30</strong>
                  <span>最晚预约时段</span>
                </div>
              </div>
            </div>
          </section>
      
          <section className={cx("section")} id="services">
            <div className={cx("wrap")}>
              <div className={cx("section-head")}>
                <div>
                  <p className={cx("section-kicker")}>SERVICES</p>
                  <h2>不同性格与毛量，都有合适护理节奏</h2>
                </div>
                <p>服务前先看皮肤、毛结、指甲和情绪状态，再安排洗护流程，减少等待和陌生环境压力。</p>
              </div>
              <div className={cx("services-grid")}>
                <article className={cx("service-card accent-mint")}>
                  <div>
                    <div className={cx("service-icon")}>
                      <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 11c0 1.7 1.3 3 3 3s3-1.3 3-3" />
                        <path d="M8 5c0 1.1-.9 2-2 2" />
                        <path d="M16 5c0 1.1.9 2 2 2" />
                        <path d="M5 10c0 5.5 3.1 10 7 10s7-4.5 7-10c0-3.9-3.1-7-7-7s-7 3.1-7 7Z" />
                      </svg>
                    </div>
                    <h3>基础洁净洗护</h3>
                    <p>温和清洁、吹干梳顺、耳眼清洁、脚底毛与指甲修整。</p>
                  </div>
                  <ul>
                    <li>适合日常维护</li>
                    <li>可选敏感肌浴液</li>
                  </ul>
                </article>
                <article className={cx("service-card accent-coral")}>
                  <div>
                    <div className={cx("service-icon")}>
                      <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m14.5 4.5 5 5" />
                        <path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
                        <path d="M13 6 18 11" />
                      </svg>
                    </div>
                    <h3>精修造型</h3>
                    <p>依据体型、毛质和主人偏好设计轮廓，保留可爱同时方便打理。</p>
                  </div>
                  <ul>
                    <li>贵宾、比熊、雪纳瑞</li>
                    <li>局部造型可单约</li>
                  </ul>
                </article>
                <article className={cx("service-card accent-sky")}>
                  <div>
                    <div className={cx("service-icon")}>
                      <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 22c4-3.3 6-6.7 6-10.2A6 6 0 0 0 6 11.8C6 15.3 8 18.7 12 22Z" />
                        <path d="M9 11h6" />
                        <path d="M12 8v6" />
                      </svg>
                    </div>
                    <h3>皮毛舒缓护理</h3>
                    <p>针对换毛、静电、毛躁和轻微打结，配合护毛素与深层梳理。</p>
                  </div>
                  <ul>
                    <li>长毛犬猫推荐</li>
                    <li>护理后记录反馈</li>
                  </ul>
                </article>
                <article className={cx("service-card accent-sun")}>
                  <div>
                    <div className={cx("service-icon")}>
                      <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 15c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5" />
                        <path d="M9 9h.01" />
                        <path d="M15 9h.01" />
                        <path d="M4.5 11.5C4.5 6.8 7.9 3 12 3s7.5 3.8 7.5 8.5S16.1 21 12 21s-7.5-4.8-7.5-9.5Z" />
                      </svg>
                    </div>
                    <h3>猫咪安静护理</h3>
                    <p>独立时段接待，减少犬只干扰，优先处理梳毛、剪甲和局部清洁。</p>
                  </div>
                  <ul>
                    <li>不强迫洗澡</li>
                    <li>胆小猫可先适应</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>
      
          <section className={cx("section alt")}>
            <div className={cx("wrap feature-band")}>
              <div className={cx("feature-photo")} role="img" aria-label="洗护后精神干净的宠物犬"></div>
              <div className={cx("feature-copy")}>
                <p className={cx("section-kicker")}>CARE FLOW</p>
                <h2>每次洗护都按状态调整，而不是照流程赶时间</h2>
                <p>毛结、皮屑、耳道潮湿和指甲长度都会影响宠物体验。我们把这些细节前置检查，给主人更清楚的护理反馈。</p>
                <div className={cx("steps")}>
                  <div className={cx("step")}>
                    <span className={cx("step-number")}>01</span>
                    <div>
                      <h3>到店评估</h3>
                      <p>确认体重、毛况、皮肤和性格，先判断是否适合当日洗护。</p>
                    </div>
                  </div>
                  <div className={cx("step")}>
                    <span className={cx("step-number")}>02</span>
                    <div>
                      <h3>分区护理</h3>
                      <p>耳眼、脚底、肛周、毛结和吹干分步骤处理，减少反复折腾。</p>
                    </div>
                  </div>
                  <div className={cx("step")}>
                    <span className={cx("step-number")}>03</span>
                    <div>
                      <h3>护理反馈</h3>
                      <p>离店前同步毛发、皮肤和居家梳理建议，方便下次维护。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
      
          <section className={cx("section")} id="pricing">
            <div className={cx("wrap")}>
              <div className={cx("section-head")}>
                <div>
                  <p className={cx("section-kicker")}>PRICING</p>
                  <h2>常用套餐</h2>
                </div>
                <p>实际价格会根据体型、毛量、打结程度和宠物配合度微调，到店评估后确认。</p>
              </div>
              <div className={cx("price-grid")}>
                <article className={cx("price-card")}>
                  <h3>清爽基础洗</h3>
                  <p>日常清洁与基础护理</p>
                  <div className={cx("price")}><strong>¥88</strong><span>起</span></div>
                  <ul>
                    <li>沐浴、吹干、梳顺</li>
                    <li>耳眼清洁、剪指甲</li>
                    <li>脚底毛与腹底修整</li>
                  </ul>
                  <a className={cx("btn btn-outline")} href="#booking">预约基础洗</a>
                </article>
                <article className={cx("price-card highlight")}>
                  <h3>精致造型洗剪</h3>
                  <p>洗护加全身造型</p>
                  <div className={cx("price")}><strong>¥168</strong><span>起</span></div>
                  <ul>
                    <li>基础洗护全套</li>
                    <li>全身轮廓修剪</li>
                    <li>面部、四肢精修</li>
                  </ul>
                  <a className={cx("btn btn-dark")} href="#booking">预约洗剪</a>
                </article>
                <article className={cx("price-card")}>
                  <h3>猫咪轻护理</h3>
                  <p>低干扰梳毛与局部清洁</p>
                  <div className={cx("price")}><strong>¥128</strong><span>起</span></div>
                  <ul>
                    <li>独立安静时段</li>
                    <li>剪甲、脚毛、耳眼</li>
                    <li>梳毛去浮毛</li>
                  </ul>
                  <a className={cx("btn btn-outline")} href="#booking">预约猫咪护理</a>
                </article>
              </div>
            </div>
          </section>
      
          <section className={cx("section alt")} id="gallery">
            <div className={cx("wrap")}>
              <div className={cx("section-head")}>
                <div>
                  <p className={cx("section-kicker")}>SALON</p>
                  <h2>明亮、分区、好清洁的洗护空间</h2>
                </div>
                <p>洗护台、吹水区、休息笼区、待客区域和前台分区管理，减少交叉等待，让宠物更快进入稳定状态。</p>
              </div>
              <div className={cx("gallery")}>
                <div className={cx("gallery-tile photo-wash")} role="img" aria-label="真实宠物洗护店洗护台照片">
                  <div className={cx("gallery-caption")}>
                    <strong>洗护台</strong>
                    <span>真实洗澡护理场景，展示清洁操作区</span>
                  </div>
                </div>
                <div className={cx("gallery-tile photo-dry")} role="img" aria-label="真实宠物洗护店吹水区照片">
                  <div className={cx("gallery-caption")}>
                    <strong>吹水区</strong>
                    <span>专业吹干设备与美容师操作场景</span>
                  </div>
                </div>
                <div className={cx("gallery-tile photo-rest")} role="img" aria-label="真实宠物休息笼区照片">
                  <div className={cx("gallery-caption")}>
                    <strong>休息笼区</strong>
                    <span>独立等待空间，减少宠物互相干扰</span>
                  </div>
                </div>
                <div className={cx("gallery-tile photo-lobby")} role="img" aria-label="真实高端宠物店待客区域照片">
                  <div className={cx("gallery-caption")}>
                    <strong>待客区域</strong>
                    <span>舒适等候、产品陈列与可视化陪伴</span>
                  </div>
                </div>
                <div className={cx("gallery-tile photo-frontdesk")} role="img" aria-label="真实高端宠物店前台照片">
                  <div className={cx("gallery-caption")}>
                    <strong>前台</strong>
                    <span>门店接待、预约登记与品牌展示</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
      
          <section className={cx("section")}>
            <div className={cx("wrap")}>
              <div className={cx("section-head")}>
                <div>
                  <p className={cx("section-kicker")}>REVIEWS</p>
                  <h2>主人们常提到的细节</h2>
                </div>
                <p>我们把洗护过程做得透明、稳定，尤其重视胆小宠物和长毛宠物的感受。</p>
              </div>
              <div className={cx("reviews-grid")}>
                <article className={cx("review-card")}>
                  <div className={cx("stars")} aria-label="5星评价">★★★★★</div>
                  <p>之前洗澡会抖，这次洗护师先让它闻环境，后面吹干也没那么抗拒。</p>
                  <strong>奶油主人</strong>
                  <span>比熊 · 精致造型洗剪</span>
                </article>
                <article className={cx("review-card")}>
                  <div className={cx("stars")} aria-label="5星评价">★★★★★</div>
                  <p>长毛猫梳开很多浮毛，回家两周都好打理，店员也会提醒哪些地方容易打结。</p>
                  <strong>糯米主人</strong>
                  <span>布偶 · 猫咪轻护理</span>
                </article>
                <article className={cx("review-card")}>
                  <div className={cx("stars")} aria-label="5星评价">★★★★★</div>
                  <p>洗完会拍照说明耳朵和皮肤状态，价格也提前说清楚，不会临时加一堆项目。</p>
                  <strong>可乐主人</strong>
                  <span>柴犬 · 基础洁净洗护</span>
                </article>
              </div>
            </div>
          </section>
      
          <section className={cx("section alt")} id="booking">
            <div className={cx("wrap")}>
              <div className={cx("section-head")}>
                <div>
                  <p className={cx("section-kicker")}>BOOKING</p>
                  <h2>预约到店</h2>
                </div>
                <p>提交后会显示预约摘要。正式排期可将表单信息复制给店员或接入后端接口。</p>
              </div>
              <div className={cx("booking-layout")}>
                <form className={cx("booking-form")} id="bookingForm">
                  <div className={cx("form-row")}>
                    <label htmlFor="ownerInput">
                      主人姓名
                      <input type="text" id="ownerInput" name="owner" placeholder="例如：林小姐" required />
                    </label>
                    <label htmlFor="phoneInput">
                      联系电话
                      <input type="tel" id="phoneInput" name="phone" placeholder="例如：13800000000" required />
                    </label>
                  </div>
                  <div className={cx("form-row")}>
                    <label htmlFor="petType">
                      宠物类型
                      <select name="petType" id="petType">
                        <option value="小型犬">小型犬</option>
                        <option value="中大型犬">中大型犬</option>
                        <option value="猫咪">猫咪</option>
                      </select>
                    </label>
                    <label htmlFor="serviceSelect">
                      预约项目
                      <select name="service" id="serviceSelect">
                        <option value="清爽基础洗">清爽基础洗</option>
                        <option value="精致造型洗剪">精致造型洗剪</option>
                        <option value="皮毛舒缓护理">皮毛舒缓护理</option>
                        <option value="猫咪轻护理">猫咪轻护理</option>
                      </select>
                    </label>
                  </div>
                  <div className={cx("form-row")}>
                    <label htmlFor="dateInput">
                      到店日期
                      <input type="date" name="date" id="dateInput" required />
                    </label>
                    <label htmlFor="timeSelect">
                      期望时段
                      <select name="time" id="timeSelect">
                        <option value="10:00 - 12:00">10:00 - 12:00</option>
                        <option value="13:30 - 15:30">13:30 - 15:30</option>
                        <option value="16:00 - 18:00">16:00 - 18:00</option>
                        <option value="18:30 - 20:30">18:30 - 20:30</option>
                      </select>
                    </label>
                  </div>
                  <label htmlFor="noteTextarea">
                    宠物情况
                    <textarea name="note" id="noteTextarea" placeholder="例如：毛结位置、是否怕吹风、是否有皮肤敏感等"></textarea>
                  </label>
                  <button className={cx("btn booking-submit")} type="submit">
                    <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 2 11 13" />
                      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                    </svg>
                    提交预约信息
                  </button>
                </form>
                <aside className={cx("booking-summary")} aria-label="预约摘要">
                  <p className={cx("section-kicker")}>SUMMARY</p>
                  <h2>本次预约</h2>
                  <div className={cx("summary-list")}>
                    <div className={cx("summary-row")}>
                      <span>宠物类型</span>
                      <strong id="summaryPet">小型犬</strong>
                    </div>
                    <div className={cx("summary-row")}>
                      <span>护理项目</span>
                      <strong id="summaryService">清爽基础洗</strong>
                    </div>
                    <div className={cx("summary-row")}>
                      <span>预约时段</span>
                      <strong id="summaryTime">10:00 - 12:00</strong>
                    </div>
                    <div className={cx("summary-row")}>
                      <span>参考价格</span>
                      <strong id="summaryPrice">¥88 起</strong>
                    </div>
                  </div>
                  <p>建议提前 10 分钟到店，首次洗护可带上常用零食，让宠物更容易放松。</p>
                  <div className={cx("hours")}>
                    <span>营业时间：周二至周日 10:00 - 21:00</span>
                    <span>门店地址：南京市江宁区汤山街道若水路2号</span>
                  </div>
                </aside>
              </div>
            </div>
          </section>
      
          <section className={cx("section alt")} id="location">
            <div className={cx("wrap")}>
              <div className={cx("section-head")}>
                <div>
                  <p className={cx("section-kicker")}>LOCATION</p>
                  <h2>四月的宠物洗护店</h2>
                </div>
              </div>
              <div className={cx("location-layout")}>
                <article className={cx("location-card")}>
                  <h3>我们的位置</h3>
                  <p className={cx("location-address")}>南京市江宁区汤山街道若水路2号</p>
                  <ul className={cx("location-list")}>
                    <li>沿若水路即可直达门店，转角处有醒目的门头。</li>
                    <li>页面内为宠物风格示意图，点按钮可直接打开百度地图导航。</li>
                    <li>建议提前 10 分钟到店，方便宠物先适应环境。</li>
                  </ul>
                  <div className={cx("location-tags")}>
                    <span>宠物友好</span>
                    <span>预约优先</span>
                    <span>贴心接待</span>
                  </div>
                  <a className={cx("btn btn-dark")} href="https://map.baidu.com/search/%E5%8D%97%E4%BA%AC%E5%B8%82%E6%B1%9F%E5%AE%81%E5%8C%BA%E6%B1%A4%E5%B1%B1%E8%A1%97%E9%81%93%E8%8B%A5%E6%B0%B4%E8%B7%AF2%E5%8F%B7" target="_blank" rel="noopener">百度地图导航</a>
                </article>
                <figure className={cx("pet-map")} aria-label="AI 宠物风格地图：南京江宁汤山若水路门店位置">
                  <div className={cx("baidu-map-wrap")}>
                    <img
                      id="baiduMapImage"
                      className={cx("baidu-map-image")}
                      src="/assets/pet-map-ai-style.svg"
                      alt="AI 宠物风格地图：沐爪宠物洗护店门店位置"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className={cx("baidu-map-fallback")} id="baiduMapFallback" hidden>
                      <div>
                        <strong>地图图片暂时未加载</strong>
                        <p>请点击左侧“百度地图导航”按钮查看门店位置。</p>
                      </div>
                    </div>
                  </div>
                  <figcaption>南京市江宁区汤山街道若水路2号</figcaption>
                </figure>
              </div>
            </div>
          </section>
      
          <section className={cx("section")} id="contact">
            <div className={cx("wrap contact-band")}>
              <div>
                <p className={cx("section-kicker")}>CONTACT</p>
                <h2>来之前先约一个舒服的时段</h2>
                <p>高峰时段会限制同时到店数量，尽量让每只宠物都有完整、安静的护理时间。</p>
              </div>
              <ul className={cx("contact-list")}>
                <li>
                  <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.8 10.7a16 16 0 0 0 4.5 4.5l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 1.9Z" />
                  </svg>
                  021-5888-6600
                </li>
                <li>
                  <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  南京市江宁区汤山街道若水路2号
                </li>
                <li>
                  <svg className={cx("icon")} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  hello@muzhua-care.example
                </li>
              </ul>
            </div>
          </section>
        </main>
      
        <footer className={cx("footer")}>
          <div className={cx("wrap")}>
            <span>© 2026 沐爪宠物洗护店</span>
            <span>温和洗护 · 精致造型 · 皮毛护理</span>
          </div>
        </footer>
      
        <div className={cx("toast")} id="toast" role="status" aria-live="polite"></div>
    </div>
  );
}
