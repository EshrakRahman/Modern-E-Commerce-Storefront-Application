import ModelImg from '@/assets/model.png';
import {clsx} from "clsx";
import { Link } from "@tanstack/react-router";

type Props = {
    className: string;
    title: string;
    slug: string;
}
export default function CtgCard({className, title, slug}: Props) {
    const linkParams = { slug };
    return(
        <Link to="/categories/$slug" params={linkParams} className={clsx("block", className)}>
            <section className="ctg-card bg-yellow-600 rounded-xl relative w-full lg:h-73 h-48 overflow-hidden">
                <div className="card  flex py-8">
                    <div className="left w-1/3 px-6">
                        <h3 className="font-primary font-bold text-2xl text-black">{title}</h3>
                    </div>
                    <div className="img w-2/3">
                        <img className="w-full h-auto object-contain scale-150"
                            src={ModelImg}
                            alt={title}
                        />
                    </div>
                </div>
            </section>
        </Link>
    )
}