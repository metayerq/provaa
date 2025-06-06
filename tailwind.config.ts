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
				'sans': ['Ubuntu', 'system-ui', 'sans-serif'],
				'serif': ['Lora', 'Georgia', 'serif'],
				'display': ['Ubuntu', 'system-ui', 'sans-serif'],
				'handwritten': ['Ubuntu', 'cursive'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Updated color palette - Deep Vibrant with Warmth
				black: 'hsl(var(--black))',
				charcoal: 'hsl(var(--charcoal))',
				mint: 'hsl(var(--mint))',
				'retro-green': 'hsl(var(--retro-green))',
				'primary-light': 'hsl(var(--primary-light))',
				'secondary-orange': 'hsl(var(--secondary-orange))',
				'secondary-orange-hover': 'hsl(var(--secondary-orange-hover))',
				'secondary-orange-light': 'hsl(var(--secondary-orange-light))',
				'accent-purple': 'hsl(var(--accent-purple))',
				'accent-purple-hover': 'hsl(var(--accent-purple-hover))',
				'accent-purple-light': 'hsl(var(--accent-purple-light))',
				white: 'hsl(var(--white))',
				'off-white': 'hsl(var(--off-white))',
				'light-gray': 'hsl(var(--light-gray))',
				'medium-gray': 'hsl(var(--medium-gray))',
				'dark-gray': 'hsl(var(--dark-gray))',
				'text-primary': 'hsl(var(--text-primary))',
				'text-secondary': 'hsl(var(--text-secondary))',
				'background-main': 'hsl(var(--background-main))',
				cream: 'hsl(var(--cream))',
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
				'bounce': {
					'0%, 100%': { 
						transform: 'translateY(0)'
					},
					'50%': { 
						transform: 'translateY(-20%)'
					}
				},
				'pulse': {
					'0%, 100%': { 
						opacity: '1'
					},
					'50%': { 
						opacity: '0.5'
					}
				},
				'line-draw': {
					from: { width: '0%' },
					to: { width: '100%' }
				},
				'word-rotate-out': {
					from: { 
						transform: 'translateY(0)',
						opacity: '1'
					},
					to: { 
						transform: 'translateY(-10px)',
						opacity: '0'
					}
				},
				'word-rotate-in': {
					from: { 
						transform: 'translateY(10px)',
						opacity: '0'
					},
					to: { 
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'underline-adjust': {
					from: { width: '0' },
					to: { width: '100%' }
				},
				'scroll-left': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				'slide-in-from-bottom-80': {
					from: { 
						transform: 'translateY(80%)',
						opacity: '0'
					},
					to: { 
						transform: 'translateY(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'bounce': 'bounce 1.5s infinite',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'line-draw': 'line-draw 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'word-rotate-out': 'word-rotate-out 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'word-rotate-in': 'word-rotate-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'underline-adjust': 'underline-adjust 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'scroll-left': 'scroll-left 30s linear infinite',
				'slide-in-from-bottom-80': 'slide-in-from-bottom-80 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
