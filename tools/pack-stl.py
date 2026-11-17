import sys,struct,numpy as np
names=['base_link','link1','link2','link3','link4','link5','link6']
# Usage: python3 tools/pack-stl.py tools/<robot>-stl public/models/<robot>.bin   (robot = cobot, robot, robot1)
# Packs the 7 binary STL links into one 16-bit quantised, indexed file read by src/three/CobotScene.js.
src,out=sys.argv[1],sys.argv[2]
head=[b'NXC1',struct.pack('<I',len(names))]; body=[]
for n in names:
    d=open(f'{src}/{n}.STL','rb').read(); k=struct.unpack('<I',d[80:84])[0]
    a=np.frombuffer(d[84:84+k*50],dtype=np.dtype([('n','<f4',3),('v','<f4',(3,3)),('a','<u2')]))
    v=a['v'].reshape(-1,3).astype(np.float64)
    mn=v.min(0); sc=(v.max(0)-mn)/65535; sc[sc==0]=1
    q=np.round((v-mn)/sc).astype(np.uint16)
    uq,inv=np.unique(q,axis=0,return_inverse=True); inv=inv.reshape(-1)
    tri=inv.reshape(-1,3); tri=tri[(tri[:,0]!=tri[:,1])&(tri[:,1]!=tri[:,2])&(tri[:,0]!=tri[:,2])]
    assert len(uq)<65536
    head.append(struct.pack('<II3f3f',len(uq),tri.size,*mn,*sc))
    p=uq.astype('<u2').tobytes(); p+=b'\0'*((-len(p))%4)
    body.append(p+tri.astype('<u2').tobytes()+b'\0'*((-tri.size*2)%4))
    print(n,k,'tris ->',len(uq),'verts')
open(out,'wb').write(b''.join(head)+b''.join(body))
