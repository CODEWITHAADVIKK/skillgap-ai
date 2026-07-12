import Image from "next/image";

export function TrustBar() {
  return (
    <section className="py-stack-lg border-y border-outline-variant/5 bg-surface-container-lowest/50">
      <div className="max-w-container-max mx-auto px-gutter text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant/50 uppercase tracking-[0.2em] mb-stack-md">
          Trusted by 10,000+ CS students from top universities
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <Image
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            alt="A minimalist tech university logo silhouette, elegant and simple design, monochrome black on a white background, clean vector style, premium academic branding."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApfia06BG2yKihOkdA_Sao_R2ZJeukNKcF6I6cMURYJV6VK8QP7n5x-s-a3WoqRlM9xlpGxzbc-mS4_j_npijo1C_2BiwR-Oavi6GHotcvNFJM_Kuog5qiddy-jE6jtlwPNfRtI0IjBQ41r-HqGhpSkSyaeW9gxWoJzdgyjO4lzj7YLdASHYIbRzecZXNCaZhAUtZpzQrPQy82tmT89HDTYJDgcRJwG9mbHcgUJdlWTm2xzwv9GAeA"
          />
          <Image
            width={120}
            height={24}
            className="h-6 w-auto object-contain"
            alt="A professional corporate recruitment agency logo, sleek typography and a geometric emblem, monochrome black, high-end minimalist corporate aesthetic."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQAfwNUqWX6yQ2miHM8tirri6x38YRgGuAHzG1GV-4KZeKY1ruzx4gz8YCGGeMntkGThCrW5RglMe3qCCbhvgrSTUkR61XcCK4-ffz_Imz1-dBDVp7o6b7eSaNFAA6yWgpjaJ2OGh4UtK3v8Ho3GX2JwVNEI9Zs6UpatQUWQtv7U14hScG2vAg7Xrb8D6xXeWZY3nU123W0CUtzOREjT8DA1VEc0s-YNYeiPh3eMqapWdej4GF_499"
          />
          <Image
            width={120}
            height={28}
            className="h-7 w-auto object-contain"
            alt="A prestigious global technology company icon, minimal black and white vector design, flat aesthetic representing innovation and industry leadership."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDulA7EPWb-RC4IxRDYq1BGNjMy5xLKiGopXsyoFhnwK-HXKou6yuHFlRFNhIZ7Q83BPaDWOIFedYUavfMI8bQAawBDh17h9Qy9l8G7K9bIPKYgvrr2bGnejh7M6L9_-i6W6kNJ7zrek-qUY7vQNieHQBB-3BxwLMz69Of5zKayluIRR7ovepytiZgdb46Utx3N1OoiD6VugV3kotF5DF746hoK4qKyyZxVeOIbfww4Abze4n65ftX9"
          />
          <Image
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            alt="A modern engineering institute emblem, simple geometric shapes forming a shield, monochrome black, clean academic and professional lines."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBve5LkKHypYF7HObu7jfrke9dsn8ttCz4YXmMYSHsKNb2xQOB-jR61CZAog5XRK6jC_MKQYz1gBzF4byStmvS50fTvcDNUZeAW1fD3SFm44eQEVL0NyAAvhPPLplMZzY5ob6NG8ju56-PLNKXnz-XlWKR9ZRPhNxYeC3tg5jlo-tN_SNwXg8jxsC2mLsYqCrFwUA32i35AcQ73czeQUMi64ajbQa8EYdNlyYMjfM1Bk5WoLrjXBnR0"
          />
          <Image
            width={120}
            height={20}
            className="h-5 w-auto object-contain"
            alt="A sophisticated digital talent network brand mark, minimal typeface with a single abstract dot element, high-end tech industry aesthetic."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxeq1pJtkTopx6M0lgcGd8K10KX0TyAI1-mpFMXpgyDcOe0oirOC7tVhTqoi8ZNprvZUVTapOJwruYqwOMugjfzOSJqu9M8F2kPJ4TQQJ-AgQDRZzrSQoJDsryaHp-Rt0pQUNI1ryKAHGTdFfUyOW3TXnTLl-H37v63b0Kp_ejvmlLIKv17wE9mXH92AHjBAo4K-n9n6Kv1RuGXmNBVogt7noTFf37XBdvW1dlHrezendnbetseDYB"
          />
        </div>
      </div>
    </section>
  );
}
