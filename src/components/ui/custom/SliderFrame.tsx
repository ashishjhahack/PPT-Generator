import { useEffect, useRef, useState } from 'react'
import FloatingActionTool from './FloatingActionTool';
import { firebaseDb, GeminiModel } from '../../../../config/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';


// It is a default HTML template for the iframe slider editor. iframe is used to render the slide content and allow users to edit it. 
// The template includes Tailwind CSS for styling, Flowbite for UI components, Font Awesome for icons, Chart.js for charts, AOS and GSAP for animations, Lottie for JSON-based animations, and Swiper.js for sliders/carousels. 
// It also has a placeholder for custom color codes and the actual slide code that will be rendered inside the iframe.
const HTML_DEFAULT = `<!DOCTYPE html>       
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
  <title>AI Website Builder</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Custom Tailwind Config for Colors -->
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {colorCodes},
        backgroundImage: {
          gradient: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)', // Primary → Secondary
        },
      },
    },
  };
</script>

  <!-- Flowbite CSS & JS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+zQj+Mj7Vp7k8E5x29nLNX6j+CWeN/Xg7fGqOpM8R1+a5/fQ1fJbO1Tz2uE5wP5yQ5uI5uA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

  <!-- Chart.js for charts & graphs -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- AOS (Animate On Scroll) for scroll animations -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

  <!-- GSAP (GreenSock) for advanced animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

  <!-- Lottie for JSON-based animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

  <!-- Swiper.js for sliders/carousels -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

  <!-- Optional: Tooltip & Popover library (Tippy.js) -->
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
  <script src="https://unpkg.com/@popperjs/core@2"></script>
  <script src="https://unpkg.com/tippy.js@6"></script>
</head>

{code}


</html>
`

type props = {
    slide: { code: string },
    colors: any,
    setUpdateSlider: any
}

// The SliderFrame component is responsible for rendering the slide content inside an iframe and allowing users to edit it.
//  It uses the HTML_DEFAULT template to set up the iframe content, and then adds event listeners to enable interactive editing of the slide elements.
//  When a user clicks on an element inside the iframe, it becomes editable, and a floating action tool appears nearby, allowing the user to enter AI prompts for editing that specific element. 
// The component also handles updating the slide code in the parent component when edits are made.
function SliderFrame({ slide, colors, setUpdateSlider }: props) {

    const { projectId } = useParams();
    const FINAL_CODE = HTML_DEFAULT               // it replaces the placeholders in the HTML_DEFAULT template with actual color codes and slide code.
        .replace("{colorCodes}", JSON.stringify(colors))
        .replace("{code}", slide?.code);

    const iframeRef = useRef<any>(null);      // ref for iframe element

    const [loading, setLoading] = useState(false);
    const selectedElRef = useRef<HTMLElement | null>(null);
    const [cardPosition, setCardPosition] = useState<{ x: number, y: number } | null>(null)    // it is used to position the floating action tool based on the selected element inside the iframe. It stores the x and y coordinates for the tool's position. When a user clicks on an element inside the iframe, the tool will appear near that element, allowing for contextual editing options.

    useEffect(() => {
        if (!iframeRef.current) return;
        const iframe = iframeRef.current;
        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        // Write the HTML inside the iframe
        doc.open();
        doc.write(FINAL_CODE);
        doc.close();

        // Allow iframe to capture keyboard events
        //doc.body.setAttribute("tabindex", "0");

        let hoverEl: HTMLElement | null = null;
        let selectedEl: HTMLElement | null = null;

        const handleMouseOver = (e: MouseEvent) => {
            if (selectedEl) return;
            const target = e.target as HTMLElement;
            if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
            hoverEl = target;
            hoverEl.style.outline = "2px dotted blue";
        };

        const handleMouseOut = () => {
            if (selectedEl) return;
            if (hoverEl) {
                hoverEl.style.outline = "";
                hoverEl = null;
            }
        };

        const handleClick = (e: MouseEvent) => {
            e.stopPropagation(); // ✅ allow editing text inside
            const target = e.target as HTMLElement;

            if (selectedEl && selectedEl !== target) {
                selectedEl.style.outline = '';
                selectedEl.removeAttribute('contenteditable')
            }

            selectedEl = target;

            selectedElRef.current = target;


            if (selectedEl && selectedEl !== target) {
                selectedEl.style.outline = "";
                selectedEl.removeAttribute("contenteditable");
            }

            selectedEl = target;
            selectedEl.style.outline = "2px solid blue";
            selectedEl.setAttribute("contenteditable", "true");
            selectedEl.focus();

            console.log("Selected element:", selectedEl);
            // ✅ Attach blur event dynamically
            // selectedEl?.addEventListener("blur", handleBlur);

            // ✅ Calculate position relative to iframe container
            const rect = target.getBoundingClientRect();
            const iframeRect = iframe.getBoundingClientRect();

            setCardPosition({        // it sets the position of the floating action tool based on the position of the selected element inside the iframe. It calculates the position by getting the bounding rectangle of the selected element and the iframe, and then adjusting it to position the tool below the selected element.
                x: iframeRect.left + rect.left + rect.width / 2,
                y: iframeRect.top + rect.bottom
            })

        };

        const handleBlur = () => {   // it is a blur event handler that is triggered when the user finishes editing an element inside the iframe. It removes the outline and contenteditable attributes from the selected element, and then updates the slider code in the parent component with the new HTML content of the iframe.
            if (selectedEl) {
                console.log("Final edited element:", selectedEl.outerHTML);
                const updatedSliderCode = iframe.contentDocument?.body?.innerHTML
                console.log(updatedSliderCode);
                setUpdateSlider(updatedSliderCode)
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {    // it is a keydown event handler that listens for the "Escape" key. When the user presses the "Escape" key, it exits the editing mode for the selected element by removing the outline and contenteditable attributes, and then sets the selected element to null.
            if (e.key === "Escape" && selectedEl) {
                selectedEl.style.outline = "";
                selectedEl.removeAttribute("contenteditable");
                selectedEl.removeEventListener("blur", handleBlur);
                selectedEl = null;

            }
        };

        // ✅ Wait for DOM content to be ready
        doc.addEventListener("DOMContentLoaded", () => {
            doc.body?.addEventListener("mouseover", handleMouseOver);
            doc.body?.addEventListener("mouseout", handleMouseOut);
            doc.body?.addEventListener("click", handleClick);
            doc.body?.addEventListener("keydown", handleKeyDown);
        });

        // ✅ Cleanup listeners on unmount
        return () => {
            doc.body?.removeEventListener("mouseover", handleMouseOver);
            doc.body?.removeEventListener("mouseout", handleMouseOut);
            doc.body?.removeEventListener("click", handleClick);
            doc.body?.removeEventListener("keydown", handleKeyDown);
        };
    }, [slide?.code]);

    const handleAiSectionChange = async (userAiPrompt: string) => {      // it is a function that handles the AI-based editing of a selected element inside the iframe. When a user enters a prompt in the floating action tool, this function is called with the user's input. It builds an AI prompt that includes the user's instruction and the current HTML of the selected element, and then sends this prompt to the GeminiModel to generate new HTML content. Once the new HTML is received, it replaces only the selected element in the iframe with the newly generated content, allowing for targeted AI-driven edits without affecting the entire slide.
        setLoading(true);
        const selectedEl = selectedElRef.current;
        const iframe = iframeRef.current;

        if (!selectedEl || !iframe) return;

        // Get the current HTML of the selected element
        const oldHTML = selectedEl.outerHTML;

        // Build AI prompt with ImageKit integration for image editing based on user instructions
        const prompt = `
  Regenerate or rewrite the following HTML code based on this user instruction.
  If user asked to change the image/regenerate the image then make sure to use
  ImageKit:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.
if user want to crop image, or remove background or scale image or optimze image then add image kit ai transfromation 
by providing ?tr=fo-auto,<other transfromation> etc.  
  "User Instruction is :${userAiPrompt}"
  HTML code:
  ${oldHTML}
  `;


        try {
            const result = await GeminiModel.generateContent(prompt);
            const newHTML = (await result.response.text()).trim();

            // ✅ Replace only the selected element
            const tempDiv = iframe.contentDocument?.createElement("div");
            if (tempDiv) {
                tempDiv.innerHTML = newHTML;
                const newNode = tempDiv.firstElementChild;

                if (newNode && selectedEl.parentNode) {    // it checks if the new HTML generated by the AI is valid and if the selected element has a parent node. If both conditions are met, it replaces only the selected element in the iframe with the newly generated content, allowing for targeted AI-driven edits without affecting the entire slide.
                    selectedEl.parentNode.replaceChild(newNode, selectedEl);
                    selectedElRef.current = newNode as HTMLElement;
                    console.log("✅ Element replaced successfully");

                    const updatedSliderCode = iframe.contentDocument?.body?.innerHTML || newHTML    // it updates the slider code in the parent component with the new HTML content of the iframe after the AI-based edit is made. It retrieves the updated HTML from the iframe's body and then calls the setUpdateSlider function to update the state in the parent component, ensuring that the changes are reflected in the overall slide code.
                    console.log(updatedSliderCode);
                    setUpdateSlider(updatedSliderCode)
                }
            }
        } catch (err) {
            console.error("AI generation failed:", err);
        }

        setLoading(false);

    }

    // ✅ Save slides to Firebase
    const SaveAllSlides = async (updatedSlides: any[]) => {
        if (!projectId) return;
        await setDoc(
            doc(firebaseDb, "projects", projectId),
            { slides: updatedSlides },
            { merge: true }
        );
        console.log("✅ Slides updated to Firestore");
    };


    return (
        <div className='mb-5'>
            <iframe
                ref={iframeRef}
                className="w-[800px] h-[500px] border-0 rounded-2xl"
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups" // ✅ full sandbox permissions
            />

            <FloatingActionTool position={cardPosition}
                onClose={() => setCardPosition(null)}
                loading={loading}
                handleAiChange={(value: string) => handleAiSectionChange(value)}
            />
        </div>
    );
}

export default SliderFrame