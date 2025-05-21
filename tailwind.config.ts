import type { Config } from "tailwindcss";
import { fontFamily as defaultFontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        sans: ["var(--font-lora)", ...defaultFontFamily.sans], 
        lora: ["var(--font-lora)"], 
        mono: ["var(--font-geist-mono)", ...defaultFontFamily.mono],
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 6px)', 
        '2xl': 'calc(var(--radius) + 12px)',
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
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1', 
            filter: 'drop-shadow(0 0 3px hsl(var(--primary)/0.6)) drop-shadow(0 0 6px hsl(var(--primary)/0.4))'
          },
          '50%': { 
            opacity: '0.8', 
            filter: 'drop-shadow(0 0 6px hsl(var(--primary)/0.8)) drop-shadow(0 0 12px hsl(var(--primary)/0.6))'
          },
        },
        'spin-slow': { 
          'to': { transform: 'rotate(360deg)' },
        },
        'subtle-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        'psi-glow': {
          '0%, 100%': {
            textShadow: '0 0 4px hsl(var(--accent)/0.3), 0 0 8px hsl(var(--accent)/0.2), 0 0 12px hsl(var(--accent)/0.1), 0 0 16px hsl(var(--primary)/0.2)',
            color: 'hsl(var(--foreground))',
          },
          '50%': {
            textShadow: '0 0 6px hsl(var(--accent)/0.5), 0 0 12px hsl(var(--accent)/0.3), 0 0 18px hsl(var(--accent)/0.2), 0 0 24px hsl(var(--primary)/0.4)',
            color: 'hsl(var(--accent-foreground))', // Slightly lighter color for glow peak
          }
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.3s ease-out', 
  			'accordion-up': 'accordion-up 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2.5s infinite ease-in-out',
        'spin-slow': 'spin-slow 10s linear infinite',
        'subtle-flicker': 'subtle-flicker 1.5s infinite ease-in-out',
        'psi-glow': 'psi-glow 3s infinite ease-in-out',
        'psi-glow-hover': 'psi-glow 2s infinite ease-in-out', // Faster on hover
  		},
      boxShadow: {
        'inner-deep': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.25)',
        'ornate': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12), inset 0 0 0 1px hsl(var(--border))',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
