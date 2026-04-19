import { Leaf, Truck, GraduationCap } from "lucide-react";

const items = [
  {
    icon: Leaf,
    title: "Premium Quality",
    body: "Hand-picked plants of the highest quality",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    body: "Quick and safe delivery to your doorstep",
  },
  {
    icon: GraduationCap,
    title: "Expert Support",
    body: "Guidance and tips for plant care",
  },
];

export function FeaturesStrip() {
  return (
    <section className="border-y border-border bg-botanical-primary-light py-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:px-6">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border">
              <item.icon className="h-6 w-6 text-botanical-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-botanical-text">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-botanical-text-muted">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
