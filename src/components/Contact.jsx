import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // 自定义弹窗状态
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success", // success | error
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_80yc9ji",
        "template_gc7je1y",
        {
          title: "Portfolio Contact",
          name: form.name,
          email: form.email,
          message: form.message,
        },
        "uapB8_EJDJhM6Ohcx"
      )
      .then(() => {
        setLoading(false);

        setForm({
          name: "",
          email: "",
          message: "",
        });

        setModal({
          isOpen: true,
          type: "success",
          title: "Message sent",
          message:
            "Thank you for reaching out. I will get back to you as soon as possible.",
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error("EmailJS error full:", error);
        console.error("status:", error?.status);
        console.error("text:", error?.text);

        setModal({
          isOpen: true,
          type: "error",
          title: "Something went wrong",
          message:
            error?.text ||
            "Your message could not be sent right now. Please try again later.",
        });
      });
  };

  return (
    <>
      <div
        className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
      >
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
        >
          <p className={styles.sectionSubText}>Get in touch</p>
          <h3 className={styles.sectionHeadText}>Contact.</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
          >
            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What should I call you?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">Your email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email address?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Message</span>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="❤️Feel free to contact with me."
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>

            <button
              type="submit"
              className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(145,94,255,0.35)] disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
        >
          <EarthCanvas />
        </motion.div>
      </div>

      {/* 自定义居中弹窗 */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 背景遮罩 */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* 弹窗主体 */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a]/90 p-6 shadow-[0_0_30px_rgba(145,94,255,0.18)]"
            >
              {/* 顶部图标 */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                    modal.type === "success"
                      ? "bg-[#915EFF]/20 text-[#a78bfa] shadow-[0_0_20px_rgba(145,94,255,0.28)]"
                      : "bg-red-500/15 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  }`}
                >
                  {modal.type === "success" ? "✓" : "!"}
                </div>

                <div>
                  <h4 className="text-white text-2xl font-bold">
                    {modal.title}
                  </h4>
                  <p className="text-secondary text-sm mt-1">
                    {modal.type === "success"
                      ? "Your message has been delivered."
                      : "There was a problem sending your message."}
                  </p>
                </div>
              </div>

              {/* 内容 */}
              <div className="mt-5">
                <p className="text-[15px] leading-7 text-[#d1d5db]">
                  {modal.message}
                </p>
              </div>

              {/* 按钮 */}
              <div className="mt-7 flex justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#915EFF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(145,94,255,0.35)] transition-all duration-300 hover:scale-[1.03]"
                >
                  Got it
                </button>
              </div>

              {/* 装饰光晕 */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#915EFF]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[#7c3aed]/10 blur-3xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(Contact, "contact");