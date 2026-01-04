import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl";
    fullScreen?: boolean;
}

export function Loader({ className, size = "md", fullScreen = false, ...props }: LoaderProps) {
    const sizeClasses = {
        sm: "w-12 h-12",
        md: "w-24 h-24",
        lg: "w-32 h-32",
        xl: "w-40 h-40",
    };

    const content = (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)} {...props}>
            <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
                {/* Outer Ring Animation */}
                <motion.div
                    className="absolute inset-0 border-4 border-primary/20 rounded-full"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Spinning Segment */}
                <motion.div
                    className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Inner DF Logo Container */}
                <div className="relative z-10 flex items-center justify-center bg-background rounded-full w-[80%] h-[80%] shadow-sm overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <img
                            src="/ds-logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Text Animation */}
            {size !== "sm" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center text-center"
                >
                    <h3 className="font-heading font-bold text-primary text-lg tracking-wide">
                        Dhanalakshmi
                    </h3>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em]">
                        Furnitures
                    </p>
                </motion.div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return <div className="flex items-center justify-center p-8">{content}</div>;
}
