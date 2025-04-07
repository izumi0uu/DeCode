"use client";

import { useState } from "react";
import { Flex, Text, Button } from "@/once-ui/components";
import Link from "next/link";
import Image from "next/image";
import styles from "./index.module.scss";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle subscription logic
      console.log(`Subscribing with email: ${email}`);
      setEmail("");
      alert("Thank you for subscribing!");
    }
  };

  return (
    <footer className={styles.footerContainer}>
      {/* Background decorations */}
      <div className={`${styles.hexagon} ${styles.hex1}`}></div>
      <div className={`${styles.hexagon} ${styles.hex2}`}></div>
      <div className={`${styles.glowSpot} ${styles.purple}`}></div>
      <div className={`${styles.glowSpot} ${styles.blue}`}></div>
      <div className={styles.gridPattern}></div>

      <div className={styles.footerGrid}>
        {/* Logo section */}
        <Flex className={styles.logoSection} direction="column" gap="m">
          <div className={styles.logoContainer}>
            <div className={styles.logoPlaceholder}>
              <Text variant="body-strong-m">DECODE LOGO</Text>
            </div>
          </div>
          <Text variant="body-default-m" className={styles.description}>
            Building the next generation of decentralized learning platforms,
            providing innovative blockchain courses and certifications through
            Web3 technology.
          </Text>
          <Flex className={styles.socialLinks} gap="m">
            <div className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </div>
            <div className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </div>
          </Flex>
        </Flex>

        {/* Learning Resources links */}
        <Flex className={styles.linksColumn} direction="column" gap="m">
          <Text variant="body-strong-l" className={styles.columnTitle}>
            Learning Resources
          </Text>
          <Flex direction="column" gap="s" className={styles.linksList}>
            <Link href="/courses" className={styles.link}>
              <Text variant="body-default-m">Course Catalog</Text>
            </Link>
            <Link href="/learning-paths" className={styles.link}>
              <Text variant="body-default-m">Learning Paths</Text>
            </Link>
            <Link href="/certifications" className={styles.link}>
              <Text variant="body-default-m">SBT Certifications</Text>
            </Link>
            <Link href="/tutorials" className={styles.link}>
              <Text variant="body-default-m">Tutorials</Text>
            </Link>
            <Link href="/blog" className={styles.link}>
              <Text variant="body-default-m">Tech Blog</Text>
            </Link>
          </Flex>
        </Flex>

        {/* About Us links */}
        <Flex className={styles.linksColumn} direction="column" gap="m">
          <Text variant="body-strong-l" className={styles.columnTitle}>
            About Us
          </Text>
          <Flex direction="column" gap="s" className={styles.linksList}>
            <Link href="/about" className={styles.link}>
              <Text variant="body-default-m">About DECODE</Text>
            </Link>
            <Link href="/team" className={styles.link}>
              <Text variant="body-default-m">Team</Text>
            </Link>
            <Link href="/partners" className={styles.link}>
              <Text variant="body-default-m">Partners</Text>
            </Link>
            <Link href="/careers" className={styles.link}>
              <Text variant="body-default-m">Join Us</Text>
            </Link>
            <Link href="/contact" className={styles.link}>
              <Text variant="body-default-m">Contact</Text>
            </Link>
          </Flex>
        </Flex>

        {/* Subscribe section */}
        <Flex className={styles.subscribeSection} direction="column" gap="m">
          <Text variant="body-strong-l" className={styles.columnTitle}>
            Subscribe
          </Text>
          <Text variant="body-default-m" className={styles.description}>
            Subscribe to our newsletter for the latest Web3 technology updates
            and course releases.
          </Text>
          <form onSubmit={handleSubscribe} className={styles.formBox}>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.subscribeButton}>
              Subscribe
            </button>
          </form>
        </Flex>
      </div>

      {/* Bottom copyright info */}
      <div className={styles.bottomBar}>
        <Text variant="body-default-s" className={styles.copyright}>
          © {new Date().getFullYear()} DECODE. All rights reserved.
        </Text>
        <Flex gap="l" className={styles.bottomLinks}>
          <Link href="/terms">
            <Text variant="body-default-s">Terms of Service</Text>
          </Link>
          <Link href="/privacy">
            <Text variant="body-default-s">Privacy Policy</Text>
          </Link>
          <Link href="/cookies">
            <Text variant="body-default-s">Cookie Policy</Text>
          </Link>
        </Flex>
      </div>
    </footer>
  );
};

export { Footer };
