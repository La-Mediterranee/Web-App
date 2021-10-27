array=( 0640x1136 0750x1334 0828x1792 1125x2436  1242x2208 1242x2688 1284x2778 1536x2048 1668x2224 1668x2388 2048x2732 )
for i in "${array[@]}"
do
  split=(${i//x/ })
  portrait=$i
  landscape=${split[1]}x${split[0]}
  gm convert -background white -geometry $((10#${split[0]})) "../static/Logos/V1.png" -gravity center -extent ${portrait}  splash-portrait-${portrait}.png
  gm convert -background white -geometry $((10#${split[0]})) "../static/Logos/V1.png" -gravity center -extent ${landscape} splash-landscape-${landscape}.png
done