import { divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { motion } from "motion/react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Handshake, Search, X } from "lucide-react";
import { useState } from "react";
import apiRequest from "@/utils/api";
import { toast } from "react-toastify";
import { User } from "@/types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/store/auth-provider";

const CustomMarker = () => (
  <div className="bg-white relative border-2 border-gray-500 z-[9999] -rotate-45 rounded-[50%_50%_50%_0%] w-full h-full flex items-center justify-center">
    <div className="img w-[90%] h-[90%] bg-gray-700 rounded-full"></div>
  </div>
);

const customIcon = divIcon({
  className: "",
  html: ReactDOMServer.renderToString(<CustomMarker />),
  iconSize: [30, 30],
  iconAnchor: [14.5, 40],
});

const Home = () => {
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [searched, setSearched] = useState(false);
  const { user, refetch } = useAuth();

  const search = () => {
    setSearched(true);
    apiRequest<User[]>({
      url: `/search?string=${input}`,
      method: "GET",
    })
      .then((res) => {
        setSearchResult(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const suggest = () => {
    setSearched(true);
    apiRequest<User[]>({
      url: `/suggest`,
      method: "GET",
    })
      .then((res) => {
        setSearchResult(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const request = (user: User) => {
    apiRequest({
      url: "/friend-request/create",
      method: "POST",
      body: {
        friendId: user.id,
      },
    })
      .then((res) => {
        console.log(res);
        refetch();
        toast.success("Request Sent");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const accept = (requestId: string) => {
    apiRequest({
      url: `/friend-request/accept`,
      method: "PUT",
      body: {
        id: requestId,
      },
    })
      .then((res) => {
        console.log(res);
        refetch();
        toast.success("Request Accepted");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const reject = (requestId: string) => {
    apiRequest({
      url: `/friend-request/reject`,
      method: "PUT",
      body: {
        id: requestId,
      },
    })
      .then((res) => {
        console.log(res);
        refetch();
        toast.success("Request Rejected");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const withdraw = (requestId: string) => {
    apiRequest({
      url: `/friend-request/withdraw`,
      method: "DELETE",
      body: {
        id: requestId,
      },
    })
      .then((res) => {
        console.log(res);
        refetch();
        toast.success("Request Withdrawn");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const removeFriend = (friendId: string) => {
    apiRequest({
      url: `/friend/remove`,
      method: "DELETE",
      body: {
        id: friendId,
      },
    })
      .then((res) => {
        console.log(res);
        refetch();
        toast.success("Friend Removed");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="w-[100vw] h-[100vh] relative">
      {/* layers */}
      <div className="layer absolute z-[2] w-full h-full bg-[radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0),rgba(255,255,255,0.3),rgba(255,255,255,0.6),rgba(255,255,255,1))] pointer-events-none"></div>
      <div className="layer absolute z-[2] w-full h-full bg-[radial-gradient(ellipse_at_70%_70%,rgba(255,255,255,0),rgba(255,255,255,0.3),rgba(255,255,255,.8))] pointer-events-none"></div>
      <div className="layer absolute z-[2] w-full h-full bg-[radial-gradient(rgba(255,255,255,0),rgba(255,255,255,.7))] pointer-events-none"></div>
      <div className="layer absolute z-[2] w-full h-full bg-[radial-gradient(ellipse_at_30%_60%,rgba(255,255,255,0),rgba(255,255,255,.4))] pointer-events-none"></div>

      <motion.div
        animate={{
          opacity: searched ? 0 : 1,
        }}
        transition={{ duration: 0.7 }}
        className="layer absolute z-[2] w-full h-full bg-white pointer-events-none"
      ></motion.div>

      {/* searchbar */}
      <motion.div
        layout
        initial={{
          top: "20%",
          left: "50%",
          translateX: "-50%",
        }}
        animate={{
          top: searched ? "10%" : "20%",
          left: "50%",
          translateX: "-50%",
        }}
        transition={{ duration: 0.7 }}
        className="search-bar flex gap-1 z-[999] absolute left-[50%] translate-x-[-50%] w-[clamp(100px,550px,90vw)]"
      >
        <div className="wrapper relative overflow-hidden flex-1 flex items-center h-[40px] rounded-l-full rounded-r-md bg-white border-[1.5px] hover:border-gray-500 focus:border-gray-500 border-gray-400">
          <input
            type="text"
            className="flex-1 h-full rounded-full px-3 outline-none text-sm"
            placeholder="Enter For Search"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSearched(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <motion.div
            className="button absolute h-[90%] aspect-square rounded-l-full flex items-center justify-center bg-gray-200 m-0.5 duration-300"
            initial={{ translateX: "100%", right: "-2px" }}
            animate={{
              translateX: !searched && input ? "0%" : "100%",
              right: searched ? 0.35 : 0,
            }}
            transition={{ duration: 0.3, damping: 0 }}
            onClick={search}
          >
            <Search size={20} />
          </motion.div>
          <motion.div
            className="button absolute h-[90%] aspect-square rounded-l-full flex items-center justify-center bg-gray-200 m-0.5 duration-300"
            initial={{ translateX: "100%", right: "-2px" }}
            animate={{
              translateX: searched ? "0%" : "100%",
              right: !searched && input ? 0.35 : 0,
            }}
            transition={{ duration: 0.3, damping: 0 }}
            onClick={() => {
              setInput("");
              setSearched(false);
              setSearchResult([]);
            }}
          >
            <X size={20} />
          </motion.div>
        </div>
        <div
          onClick={suggest}
          className="suggest cursor-pointer h-[40px] rounded-[10px_100px_100px_10px] bg-white border-[1.5px] hover:border-gray-500 focus:border-gray-500 border-gray-400 flex items-center justify-center px-3"
        >
          Suggest
        </div>
      </motion.div>

      <motion.div
        initial={{
          top: "30%",
          left: "50%",
          translateX: "-50%",
        }}
        animate={{
          top: searched ? "100%" : "30%",
          left: "50%",
          translateX: "-50%",
        }}
        transition={{ duration: 0.8 }}
        className="absolute w-[clamp(100px,550px,90vw)] z-[999]"
      >
        <div className="wrapper relative w-full">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="1"
          >
            <AccordionItem
              value={"1"}
              key={"1"}
              className="overflow-hidden border bg-background first:rounded-t-lg last:rounded-b-lg"
            >
              <AccordionTrigger className="px-4 py-3 text-[15px] leading-6 hover:no-underline">
                Friends
              </AccordionTrigger>
              <AccordionContent className="p-0">
                {user?.friends?.length ?? 0 > 0 ? (
                  user?.friends?.map((friend) => (
                    <div className="flex justify-between items-center w-full px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="img w-[40px] h-[40px] bg-gray-700 rounded-full"></div>
                        <div className="name">{friend.name}</div>
                      </div>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="appearance-none px-3 py-1 rounded-sm bg-red-500 hover:bg-red-600 duration-200 text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 pb-4">
                    You Don't Have Any Friends! 😢, Create Some Here
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value={"2"}
              key={"2"}
              className="overflow-hidden border bg-background first:rounded-t-lg last:rounded-b-lg"
            >
              <AccordionTrigger className="px-4 py-3 text-[15px] leading-6 hover:no-underline">
                Friend Requests
              </AccordionTrigger>
              <AccordionContent className="p-0">
                {user?.sentRequests?.length ?? 0 > 0 ? (
                  user?.sentRequests?.map((friendRequest) => (
                    <div className="flex justify-between items-center w-full bg-gray-100 py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="img w-[30px] h-[30px] bg-gray-700 rounded-full"></div>
                        <div className="name">
                          {friendRequest.receiver.name}
                        </div>
                      </div>
                      {friendRequest.status === "PENDING" ? (
                        <button
                          onClick={() => withdraw(friendRequest.id)}
                          className="appearance-none px-3 py-1 rounded-sm bg-red-500 hover:bg-red-600 duration-200 text-white text-xs"
                        >
                          Withdraw
                        </button>
                      ) : friendRequest.status === "ACCEPTED" ? (
                        <div className="text-green-500">Accepted</div>
                      ) : (
                        <div className="text-red-500">Rejected</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 pb-4">
                    Have'nt Sent Any Friend Requests Yet! 😢, Connect With World
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value={"3"}
              key={"3"}
              className="overflow-hidden border bg-background first:rounded-t-lg last:rounded-b-lg"
            >
              <AccordionTrigger className="px-4 py-3 text-[15px] leading-6 hover:no-underline">
                Received Requests
              </AccordionTrigger>
              <AccordionContent className="p-0">
                {user?.receivedRequests?.length ?? 0 > 0 ? (
                  user?.receivedRequests.map((receivedRequest) => (
                    <div className="flex justify-between items-center w-full bg-gray-100 py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="img w-[30px] h-[30px] bg-gray-700 rounded-full"></div>
                        <div className="name">
                          {receivedRequest.sender.name}
                        </div>
                      </div>
                      {receivedRequest.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => accept(receivedRequest.id)}
                            className="appearance-none px-3 py-1 rounded-sm bg-green-500 hover:bg-green-600 duration-200 text-white text-xs"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => reject(receivedRequest.id)}
                            className="appearance-none px-3 py-1 rounded-sm bg-red-500 hover:bg-red-600 duration-200 text-white text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : receivedRequest.status === "ACCEPTED" ? (
                        <div className="text-green-500">Accepted</div>
                      ) : (
                        <div className="text-red-500">Rejected</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 pb-4">
                    Request is Coming On The Way, Be Ready! 😊
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </motion.div>

      {/* map */}
      <MapContainer
        style={{
          height: "100vh",
          width: "100%",
          // filter: "saturate(.13) brightness(1.1)",
        }}
        center={[21.7537, 78.9629]}
        zoom={5}
        zoomControl={false}
        inertia
        inertiaDeceleration={1000}
        fadeAnimation
        minZoom={5}
        maxZoom={12}
        bounceAtZoomLimits
        zoomAnimation
        className="z-[1]"
      >
        {/* add google map tile url  */}
        <TileLayer
          className="z-[1]"
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        />
        {searchResult.map(
          (user) =>
            user.address?.location.lat &&
            user.address?.location.long && (
              <Marker
                icon={customIcon}
                position={[
                  user.address?.location.lat,
                  user.address?.location.long,
                ]}
                autoPanOnFocus
                zIndexOffset={5}
                interactive
              >
                <Popup
                  closeOnEscapeKey
                  offset={[0, -35]}
                  className="-mt-[100%]"
                  closeButton={false}
                  autoClose
                  maxWidth={200}
                >
                  <div className="flex flex-col z-[9999]">
                    <div className="name font-semibold">{user.name}</div>
                    <div className="address text-xs">{`${user.address.city} ${user.address.zip}`}</div>
                    <button
                      onClick={() => request(user)}
                      className="appearance-none w-full px-3 py-1 rounded-sm bg-green-500 hover:bg-green-600 duration-200 text-white mt-2 flex gap-1 items-center justify-center"
                    >
                      <Handshake size={15} />
                      Request
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
};

export default Home;
