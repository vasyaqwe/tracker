type IconProps = React.ComponentProps<"svg">

export const Icons = {
   minus: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="2"
         stroke="currentColor"
         {...props}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14"
         />
      </svg>
   ),
   plus: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M12 19V12M12 12V5M12 12L5 12M12 12L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   arrowUp: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M6 9.8304C7.55556 7.727 9.37278 5.83783 11.4057 4.20952C11.5801 4.06984 11.79 4 12 4M18 9.8304C16.4444 7.727 14.6272 5.83783 12.5943 4.20952C12.4199 4.06984 12.21 4 12 4M12 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   arrowLeft: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M9.8304 6C7.727 7.55556 5.83783 9.37278 4.20952 11.4057C4.06984 11.5801 4 11.79 4 12M9.8304 18C7.727 16.4444 5.83783 14.6272 4.20952 12.5943C4.06984 12.4199 4 12.21 4 12M4 12H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   chevronUp: (props: IconProps) => (
      <svg
         width="10"
         height="7"
         viewBox="0 0 14 8"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M1 7C2.57701 4.81921 4.42293 2.86359 6.48988 1.18284C6.78967 0.939055 7.21033 0.939055 7.51012 1.18284C9.57706 2.86359 11.423 4.81921 13 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   chevronDown: (props: IconProps) => (
      <svg
         width="10"
         height="7"
         viewBox="0 0 10 7"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M1 1.13916C2.06206 2.60104 3.30708 3.91044 4.70212 5.03336C4.87737 5.17443 5.12263 5.17443 5.29788 5.03336C6.69292 3.91044 7.93794 2.60104 9 1.13916"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   check: ({ className, ...props }: IconProps) => (
      <svg
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M5 12.7132L10.0168 17.7247L10.4177 17.0238C12.5668 13.2658 15.541 10.0448 19.1161 7.60354L20 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   xMark: (props: IconProps) => (
      <svg
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M6 18L12 12M12 12L18 6M12 12L6 6M12 12L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   ),
   trash: (props: IconProps) => (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth="2"
         stroke="currentColor"
         {...props}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
         />
      </svg>
   ),
   github: (props: IconProps) => (
      <svg
         data-slot="icon"
         viewBox="0 0 256 250"
         width="256"
         height="250"
         fill="currentColor"
         xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid"
         {...props}
      >
         <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
      </svg>
   ),
}
