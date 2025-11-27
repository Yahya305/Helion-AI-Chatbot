import type { User } from "@/lib/userApi";
import React from "react";

type Props = {
    user?: User | null;
};

const PlaceholderAvatar: React.FC<Props> = ({ user }) => {
    return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-semibold flex-shrink-0">
            {user?.username ? user.username.charAt(0).toUpperCase() : "G"}
        </div>
    );
};

export default PlaceholderAvatar;
