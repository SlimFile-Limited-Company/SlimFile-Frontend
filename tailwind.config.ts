
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#dc2626', // Red-600
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#f3f4f6', // Gray-100
					foreground: '#374151'
				},
				destructive: {
					DEFAULT: '#dc2626',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#f9fafb',
					foreground: '#6b7280'
				},
				accent: {
					DEFAULT: '#fef2f2', // Red-50
					foreground: '#dc2626'
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#111827'
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#111827'
				},
				sidebar: {
					DEFAULT: '#ffffff',
					foreground: '#374151',
					primary: '#dc2626',
					'primary-foreground': '#ffffff',
					accent: '#fef2f2',
					'accent-foreground': '#dc2626',
					border: '#e5e7eb',
					ring: '#dc2626'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'pulse-red': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 0 10px rgba(220, 38, 38, 0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in': 'slide-in 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'pulse-red': 'pulse-red 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
